import { blur } from "@/lib/pixels";
import { randomBetween } from "@/lib/random";

/** The colour of the paper the cat draws on: a warm off-white. */
export const PAPER_COLOR = { red: 253, green: 251, blue: 247 };

const GRAIN = 6; // how much each pixel's brightness can vary, from 0 (flat) to ~20 (very rough)
const GRAIN_SOFTNESS = 1; // blur radius: 0 = sharp noise, 1–2 = soft paper fibres

/**
 * A sheet of drawing paper: the paper colour with a subtle, random grain.
 * @param {number} width
 * @param {number} height
 * @param {() => number} random - the style's seeded generator, so the grain is always the same for the same photo
 * @returns {ImageData}
 */
export function paperTexture(width, height, random) {
	// TODO 1: create the ImageData and its `data` shortcut
	// TODO 2: loop over the data four values at a time (i += 4), like in grayscale
	// TODO 3: pick ONE random offset per pixel: grain = randomBetween(random, -GRAIN, GRAIN)
	//   (the same offset for red, green and blue keeps the paper's colour, only lighter or darker)
	// TODO 4: write PAPER_COLOR.red + grain, PAPER_COLOR.green + grain and PAPER_COLOR.blue + grain,
	//   and alpha 255 (the paper is fully opaque)
	// TODO 5: soften the grain and return it: return blur(texture, GRAIN_SOFTNESS);
}
