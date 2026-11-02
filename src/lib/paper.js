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
	const texture = new ImageData(width, height);
	const dst = texture.data;
	for (let i = 0; i < dst.length; i += 4) {
		const grain = randomBetween(random, -GRAIN, GRAIN);
		dst[i] = PAPER_COLOR.red + grain;
		dst[i + 1] = PAPER_COLOR.green + grain;
		dst[i + 2] = PAPER_COLOR.blue + grain;
		dst[i + 3] = 255;
	}
	return blur(texture, GRAIN_SOFTNESS);
}
