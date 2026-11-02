import { blur, grayscale } from "@/lib/pixels";
import { createRandom, randomBetween } from "@/lib/random";

// How the pencil behaves. Tweak these and see what changes!
const BLUR_RADIUS = 2; // smooths the photo so single noisy pixels don't get strokes
const SPACING = 5; // distance between places where a stroke may start, in pixels
const STROKE_LENGTH = 12; // in pixels
const HATCH_ANGLE = -Math.PI / 4; // -45°: strokes go "/" like a right-handed artist's hatching
const ANGLE_WOBBLE = 0.25; // how much each stroke's angle can vary, in radians
const CONTRAST = 1.6; // > 1 keeps light areas cleaner and makes dark areas stand out
const GRAPHITE = "#2b2b2b";

/**
 * Graphite pencil, first version: diagonal hatching that gets denser where the photo is darker.
 * @param {ImageData} imageData - the photo
 * @returns {{ marks: import("@/lib/marks").Mark[] }}
 */
export function pencil(imageData) {
	const tones = blur(grayscale(imageData), BLUR_RADIUS);
	const random = createRandom(seedFrom(tones));
	const marks = [];

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
