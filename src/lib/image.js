const SUPPORTED_TYPES = [
	"image/avif",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp",
];

const MAX_SIZE_MB = 25;

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
