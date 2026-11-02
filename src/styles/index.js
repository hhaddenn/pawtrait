import { pencil } from "@/styles/pencil";

/**
 * What a style returns: the marks to draw and, optionally, a layer to paint under them.
 * @typedef {object} StyleResult
 * @property {ImageData} [base] - drawn under the marks, e.g. the paper grain (optional)
 * @property {import("@/lib/marks").Mark[]} marks - in the order they are drawn
 */

/**
 * A way of drawing a photo: its names and the function that makes the marks.
 * @typedef {object} Style
 * @property {string} id - short name for code and file names, e.g. "pencil"
 * @property {string} name - the name shown to people, e.g. "Pencil"
 * @property {(imageData: ImageData) => StyleResult} draw - turns a photo into marks
 */

/**
 * Every style the cat knows, in the order they appear in the style picker.
 * @type {Style[]}
 */
export const STYLES = [{ id: "pencil", name: "Pencil", draw: pencil }];

/** The style used before the person picks one. */
export const DEFAULT_STYLE = STYLES[0];
