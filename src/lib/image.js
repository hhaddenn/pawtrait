const SUPPORTED_TYPES = [
	"image/avif",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp",
];

const MAX_SIZE_MB = 25;
export const MAX_WIDTH = 1000;

/** Checks whether a file can be used as a photo. Returns an error message, or null if it's valid. */
export function validateImageFile(file) {
	if (!SUPPORTED_TYPES.includes(file.type)) {
		return "Choose a JPEG, PNG, WebP, GIF or AVIF image.";
	}
	if (file.size > MAX_SIZE_MB * 1024 * 1024) {
		return `The photo is too big (max ${MAX_SIZE_MB} MB).`;
	}
	return null;
}

/** Shrinks a size to fit maxWidth, keeping its proportions. Never enlarges. */
export function fitToWidth(width, height, maxWidth) {
	const scale = Math.min(1, maxWidth / width);
	return {
		width: Math.round(width * scale),
		height: Math.round(height * scale),
	};
}

/** Decodes a photo file into pixels, rotated upright using its EXIF data. */
export async function loadBitmap(file) {
	const bitmap = await createImageBitmap(file, {
		imageOrientation: "from-image",
	});
	return bitmap;
}

/**
 * Decodes a photo and returns its raw pixels, upright and at most MAX_WIDTH pixels wide.
 * Nothing is shown on screen: this is what the drawing styles analyse.
 */
export async function loadImageData(file) {
	const bitmap = await loadBitmap(file);
	const size = fitToWidth(bitmap.width, bitmap.height, MAX_WIDTH);
	const canvas = new OffscreenCanvas(size.width, size.height);
	const ctx = canvas.getContext("2d", {
		willReadFrequently: true,
	});
	ctx.drawImage(bitmap, 0, 0, size.width, size.height);
	bitmap.close();
	return ctx.getImageData(0, 0, size.width, size.height);
}
