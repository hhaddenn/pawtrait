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

/**
 * Returns a blurred copy of the image: every pixel becomes the average of the square around it.
 * `radius` is how many pixels the square reaches on each side (radius 2 → a 5 × 5 square).
 * The original ImageData is left untouched.
 */
export function blur(imageData, radius) {
	const width = imageData.width;
	const height = imageData.height;
	const output = new ImageData(width, height);
	const src = imageData.data;
	const dst = output.data;

	for (let y = 0; y < height; y += 1) {
		for (let x = 0; x < width; x += 1) {
			let sumRed = 0;
			let sumGreen = 0;
			let sumBlue = 0;
			let sumAlpha = 0;
			let count = 0;
			for (let dy = -radius; dy <= radius; dy += 1) {
				for (let dx = -radius; dx <= radius; dx += 1) {
					const nx = clamp(x + dx, 0, width - 1);
					const ny = clamp(y + dy, 0, height - 1);
					const index = (ny * width + nx) * 4;
					sumRed += src[index];
					sumGreen += src[index + 1];
					sumBlue += src[index + 2];
					sumAlpha += src[index + 3];
					count += 1;
				}
			}
			const index = (y * width + x) * 4;
			dst[index] = sumRed / count;
			dst[index + 1] = sumGreen / count;
			dst[index + 2] = sumBlue / count;
			dst[index + 3] = sumAlpha / count;
		}
	}
	return output;
}

function clamp(value, min, max) {
	if (value === Math.min(value, min, max)) {
		return min;
	} else {
		if (value === Math.max(value, min, max)) {
			return max;
		}
	}
	return value;
}

// Sobel kernels: how much each of the 8 neighbours counts when measuring the change in brightness.
// Rows are dy = -1, 0, +1 and columns are dx = -1, 0, +1.
const SOBEL_X = [
	[-1, 0, 1],
	[-2, 0, 2],
	[-1, 0, 1],
];
const SOBEL_Y = [
	[-1, -2, -1],
	[0, 0, 0],
	[1, 2, 1],
];

/**
 * Finds the edges of a greyscale image with the Sobel operator.
 * For every pixel it measures how fast the brightness changes, and in which direction.
 * @param {ImageData} imageData - a greyscale image (red = green = blue)
 * @returns {{ width: number, height: number, magnitude: Float32Array, angle: Float32Array }}
 *   magnitude: how strong the edge is (0 = flat). angle: the direction the edge runs along, in radians.
 *   Both have ONE value per pixel, at index y × width + x (no × 4!)
 */
export function sobel(imageData) {
	const width = imageData.width;
	const height = imageData.height;
	const src = imageData.data;
	const magnitude = new Float32Array(width * height);
	const angle = new Float32Array(width * height);

	for (let y = 0; y < height; y += 1) {
		for (let x = 0; x < width; x += 1) {
			let gx = 0;
			let gy = 0;

			for (let dy = -1; dy <= 1; dy += 1) {
				for (let dx = -1; dx <= 1; dx += 1) {
					const nx = clamp(x + dx, 0, width - 1);
					const ny = clamp(y + dy, 0, height - 1);
					const index = (ny * width + nx) * 4;
					const brightness = src[index];
					gx += brightness * SOBEL_X[dy + 1][dx + 1];
					gy += brightness * SOBEL_Y[dy + 1][dx + 1];
				}
			}
			const index = y * width + x;
			magnitude[index] = Math.hypot(gx, gy);
			angle[index] = Math.atan2(gy, gx) + Math.PI / 2;
		}
	}
	return { width, height, magnitude, angle };
}
