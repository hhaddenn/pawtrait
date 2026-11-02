import { blur, grayscale, sobel } from "@/lib/pixels";
import { createRandom, randomBetween } from "@/lib/random";
import { paperTexture } from "@/lib/paper";

// How the pencil behaves. Tweak these and see what changes!
const BLUR_RADIUS = 2; // smooths the photo so single noisy pixels don't get strokes
const SPACING = 5; // distance between places where a stroke may start, in pixels
const STROKE_LENGTH = 12; // in pixels
const HATCH_ANGLE = -Math.PI / 4; // -45°: strokes go "/" like a right-handed artist's hatching
const ANGLE_WOBBLE = 0.25; // how much each stroke's angle can vary, in radians
const CONTRAST = 1.6; // > 1 keeps light areas cleaner and makes dark areas stand out
const GRAPHITE = "#2b2b2b";

// Contour strokes: the lines that outline the face (jaw, eyes, nose)
const CONTOUR_SPACING = 3; // contours are drawn on a finer grid than the hatching
const CONTOUR_LENGTH = 8; // in pixels
const EDGE_THRESHOLD = 0.15; // edges weaker than this (0–1) are ignored
// The strongest possible Sobel magnitude: a jump from 0 to 255 seen by both kernels (4 × 255 × √2)
const MAX_MAGNITUDE = 4 * 255 * Math.SQRT2;

// Flow: the direction the hatching follows, so shading curves with the shape
const FLOW_BLUR_RADIUS = 6; // a much softer blur than the contours: we want the big shapes, not the details
const FLOW_THRESHOLD = 0.02; // below this (0–1) an area is "flat": keep the classic HATCH_ANGLE

// Hand tremor: real strokes are never perfectly straight
const STROKE_POINTS = 4; // points per stroke (2 = a straight line, more = a wobblier line)
const TREMOR = 0.7; // how far each point can drift sideways, in pixels

// Cross-hatching: a second layer of strokes in another direction, only in the darkest shadows
const CROSS_THRESHOLD = 0.55; // darkness (0–1) above which cross-hatching starts
const CROSS_ANGLE = Math.PI / 2.5; // ~72°: the second layer crosses the first at this angle

/**
 * Graphite pencil, first version: diagonal hatching that gets denser where the photo is darker.
 * @param {ImageData} imageData - the photo
 * @returns {{ marks: import("@/lib/marks").Mark[] }}
 */
export function pencil(imageData) {
	const tones = blur(grayscale(imageData), BLUR_RADIUS);
	const random = createRandom(seedFrom(tones));
	const marks = [];
	const edges = sobel(tones);
	const flow = sobel(blur(tones, FLOW_BLUR_RADIUS));

	// Contours (outline): short firm strokes along the edges, drawn first
	for (let y = 0; y < edges.height; y += CONTOUR_SPACING) {
		for (let x = 0; x < edges.width; x += CONTOUR_SPACING) {
			const index = y * edges.width + x;
			const strength = edges.magnitude[index] / MAX_MAGNITUDE;
			if (strength < EDGE_THRESHOLD) {
				continue;
			}
			if (random() > strength) {
				continue;
			}
			const angle =
				edges.angle[index] +
				randomBetween(random, -ANGLE_WOBBLE / 2, +ANGLE_WOBBLE / 2);
			const cx =
				x +
				randomBetween(
					random,
					-CONTOUR_SPACING / 2,
					CONTOUR_SPACING / 2,
				);
			const cy =
				y +
				randomBetween(
					random,
					-CONTOUR_SPACING / 2,
					CONTOUR_SPACING / 2,
				);
			const lineMark = {
				type: "line",
				points: handDrawnPoints(random, cx, cy, angle, CONTOUR_LENGTH),
				width: randomBetween(random, 0.8, 1.6),
				color: GRAPHITE,
				opacity: 0.5 + strength * 0.4,
			};
			marks.push(lineMark);
		}
	}

	const crossMarks = [];

	// Hatching (shading): strokes that follow the shape (diagonal where it's flat), denser where it's darker
	for (let y = 0; y < tones.height; y += SPACING) {
		for (let x = 0; x < tones.width; x += SPACING) {
			const darkness = 1 - brightnessAt(tones, x, y) / 255;
			if (random() > darkness ** CONTRAST) {
				continue;
			}
			const cx = x + randomBetween(random, -SPACING / 2, SPACING / 2);
			const cy = y + randomBetween(random, -SPACING / 2, SPACING / 2);
			const index = y * tones.width + x;
			const flowStrength = flow.magnitude[index] / MAX_MAGNITUDE;
			const baseAngle =
				flowStrength > FLOW_THRESHOLD ? flow.angle[index] : HATCH_ANGLE;
			const angle =
				baseAngle + randomBetween(random, -ANGLE_WOBBLE, +ANGLE_WOBBLE);
			const lineMark = {
				type: "line",
				points: handDrawnPoints(random, cx, cy, angle, STROKE_LENGTH),
				width: randomBetween(random, 0.6, 1.4),
				color: GRAPHITE,
				opacity: 0.25 + darkness * 0.6,
			};
			marks.push(lineMark);

			// Cross-hatching: a second stroke in the darkest shadows
			if (darkness <= CROSS_THRESHOLD) {
				continue;
			}

			const crossChance =
				(darkness - CROSS_THRESHOLD) / (1 - CROSS_THRESHOLD);
			if (random() > crossChance) {
				continue;
			}

			const secondAngle =
				baseAngle +
				CROSS_ANGLE +
				randomBetween(random, -ANGLE_WOBBLE, +ANGLE_WOBBLE);
			const secondLineMark = {
				type: "line",
				points: handDrawnPoints(
					random,
					cx,
					cy,
					secondAngle,
					STROKE_LENGTH,
				),
				width: randomBetween(random, 0.5, 1.2),
				color: GRAPHITE,
				opacity: 0.2 + darkness * 0.5,
			};
			crossMarks.push(secondLineMark);
		}
	}

	marks.push(...crossMarks);

	// The paper comes last: it uses one random number per pixel, so making it earlier would change every stroke
	const base = paperTexture(tones.width, tones.height, random);

	return { base, marks };
}

/**
 * The points of a hand-drawn stroke: from one end, through the centre, to the other end,
 * each point nudged a little sideways like a real hand would.
 * @param {() => number} random - the style's generator
 * @param {number} cx - centre of the stroke
 * @param {number} cy - centre of the stroke
 * @param {number} angle - direction of the stroke, in radians
 * @param {number} length - in pixels
 * @returns {{ x: number, y: number }[]}
 */
function handDrawnPoints(random, cx, cy, angle, length) {
	const ax = Math.cos(angle);
	const ay = Math.sin(angle);
	const px = -ay;
	const py = ax;

	const points = [];
	for (let i = 0; i < STROKE_POINTS; i += 1) {
		const t = i / (STROKE_POINTS - 1) - 0.5;
		const along = t * length;
		const across = randomBetween(random, -TREMOR, TREMOR);
		points.push({
			x: cx + ax * along + px * across,
			y: cy + ay * along + py * across,
		});
	}
	return points;
}

/**
 * The brightness (0–255) of the pixel at (x, y) of a greyscale image.
 * In a greyscale image red = green = blue, so reading red is enough.
 */
function brightnessAt(imageData, x, y) {
	return imageData.data[(y * imageData.width + x) * 4];
}

/**
 * A seed that depends on what the photo looks like: the same photo always gives the same seed,
 * a different photo (almost always) a different one.
 */
function seedFrom(imageData) {
	let sum = 0;
	for (let i = 0; i < imageData.data.length; i += 997) {
		sum += imageData.data[i];
	}
	return sum;
}
