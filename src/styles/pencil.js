import { blur, grayscale, sobel } from "@/lib/pixels";
import { createRandom, randomBetween } from "@/lib/random";

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

			const dx = (Math.cos(angle) * CONTOUR_LENGTH) / 2;
			const dy = (Math.sin(angle) * CONTOUR_LENGTH) / 2;
			const start = { x: cx - dx, y: cy - dy };
			const end = { x: cx + dx, y: cy + dy };
			const lineMark = {
				type: "line",
				points: [start, end],
				width: randomBetween(random, 0.8, 1.6),
				color: GRAPHITE,
				opacity: 0.5 + strength * 0.4,
			};
			marks.push(lineMark);
		}
	}

	// Hatching (shading): diagonal strokes, denser where it's darker
	for (let y = 0; y < tones.height; y += SPACING) {
		for (let x = 0; x < tones.width; x += SPACING) {
			const darkness = 1 - brightnessAt(tones, x, y) / 255;
			if (random() > darkness ** CONTRAST) {
				continue;
			}
			const cx = x + randomBetween(random, -SPACING / 2, SPACING / 2);
			const cy = y + randomBetween(random, -SPACING / 2, SPACING / 2);
			const angle =
				HATCH_ANGLE +
				randomBetween(random, -ANGLE_WOBBLE, +ANGLE_WOBBLE);
			const dx = (Math.cos(angle) * STROKE_LENGTH) / 2;
			const dy = (Math.sin(angle) * STROKE_LENGTH) / 2;
			const start = { x: cx - dx, y: cy - dy };
			const end = { x: cx + dx, y: cy + dy };
			const lineMark = {
				type: "line",
				points: [start, end],
				width: randomBetween(random, 0.6, 1.4),
				color: GRAPHITE,
				opacity: 0.25 + darkness * 0.6,
			};
			marks.push(lineMark);
		}
	}

	return { marks };
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
