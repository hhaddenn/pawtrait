/**
 * Returns a new ImageData with every colour flipped, like a photo negative.
 * The original ImageData is left untouched.
 */
export function invert(imageData) {
	const output = new ImageData(imageData.width, imageData.height);
	const src = imageData.data; // read from here
	const dst = output.data; // write here

	for (let i = 0; i < src.length; i += 4) {
		dst[i] = 255 - src[i];
		dst[i + 1] = 255 - src[i + 1];
		dst[i + 2] = 255 - src[i + 2];
		dst[i + 3] = src[i + 3];
	}
	return output;
}

const RED_WEIGHT = 0.299;
const GREEN_WEIGHT = 0.587;
const BLUE_WEIGHT = 0.114;

/**
 * Returns a new ImageData in shades of grey, using how bright each colour looks to the human eye.
 * The original ImageData is left untouched.
 */
export function grayscale(imageData) {
	const output = new ImageData(imageData.width, imageData.height);
	const src = imageData.data;
	const dst = output.data;

	for (let i = 0; i < src.length; i += 4) {
		const gray =
			src[i] * RED_WEIGHT +
			src[i + 1] * GREEN_WEIGHT +
			src[i + 2] * BLUE_WEIGHT;
		dst[i] = gray;
		dst[i + 1] = gray;
		dst[i + 2] = gray;
		dst[i + 3] = src[i + 3];
	}
	return output;
}
