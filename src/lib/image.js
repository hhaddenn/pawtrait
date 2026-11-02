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
