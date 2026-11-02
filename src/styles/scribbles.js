import { createRandom, randomBetween } from "@/lib/random";

const SEED = 42;

/**
 * Temporary test style: short random strokes all over the sheet. It ignores what the photo looks like,
 * it only uses its size. (The pencil style in 4.5b replaces it.)
 * @param {ImageData} imageData - the analysed photo
 * @returns {{ marks: import("@/lib/marks").Mark[] }}
 */
export function scribbles(imageData) {
	const random = createRandom(SEED);
	const marks = [];

	for (let i = 0; i < 300; i += 1) {
		const x = randomBetween(random, 0, imageData.width);
		const y = randomBetween(random, 0, imageData.height);
		const length = randomBetween(random, 5, 25);
		const angle = randomBetween(random, 0, Math.PI * 2);
		const endPoint = {
			x: x + Math.cos(angle) * length,
			y: y + Math.sin(angle) * length,
		};
		const lineMark = {
			type: "line",
			points: [{ x, y }, endPoint],
			width: randomBetween(random, 0.5, 2),
			color: "#2b2b2b",
			opacity: randomBetween(random, 0.3, 0.9),
		};
		marks.push(lineMark);
	}

	return { marks };
}
