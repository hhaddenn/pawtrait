// Constants of a classic linear congruential generator (from "Numerical Recipes")
const MULTIPLIER = 1664525;
const INCREMENT = 1013904223;
const MODULUS = 2 ** 32;

/**
 * Creates a seeded random number generator: the same seed always gives the same sequence.
 * Styles use it instead of Math.random(), so the same photo always gives the same drawing.
 * @param {number} seed - any whole number
 * @returns {() => number} a function that returns a new number in [0, 1) every time it's called
 */
export function createRandom(seed) {
	let state = seed % MODULUS;

	return function next() {
		state = (state * MULTIPLIER + INCREMENT) % MODULUS;
		return state / MODULUS;
	};
}

/**
 * Returns a random number between min and max, using the given generator.
 * @param {() => number} random - a generator made by createRandom
 * @param {number} min
 * @param {number} max
 */
export function randomBetween(random, min, max) {
	return min + random() * (max - min);
}
