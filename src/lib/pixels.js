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
