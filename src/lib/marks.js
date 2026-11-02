/**
 * A round dot, e.g. one dot of the halftone style.
 * @typedef {object} DotMark
 * @property {"dot"} type
 * @property {number} x - centre, in canvas pixels
 * @property {number} y - centre, in canvas pixels
 * @property {number} radius - in canvas pixels
 * @property {string} color - any CSS colour, e.g. "#2b2b2b"
 * @property {number} opacity - from 0 (invisible) to 1 (solid)
 */

/**
 * A pencil stroke through several points.
 * @typedef {object} LineMark
 * @property {"line"} type
 * @property {{ x: number, y: number }[]} points - the stroke goes through these, in order (canvas pixels)
 * @property {number} width - stroke thickness, in canvas pixels
 * @property {string} color - any CSS colour, e.g. "#2b2b2b"
 * @property {number} opacity - from 0 (invisible) to 1 (solid)
 */

/** @typedef {DotMark | LineMark} Mark */

/**
 * Draws every mark, in order, onto a canvas 2D context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Mark[]} marks
 */
export function drawMarks(ctx, marks) {
	for (const mark of marks) {
		drawMark(ctx, mark);
	}
}

/**
 * Draws a single mark. Each mark type has its own drawing function.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Mark} mark
 */
function drawMark(ctx, mark) {
	switch (mark.type) {
		case "dot":
			drawDot(ctx, mark);
			break;
		case "line":
			drawLine(ctx, mark);
			break;
		default:
			throw new Error(`Unknown mark type: ${mark.type}`);
	}
}

/** @param {CanvasRenderingContext2D} ctx @param {DotMark} dot */
function drawDot(ctx, dot) {
	ctx.save();
	ctx.globalAlpha = dot.opacity;
	ctx.fillStyle = dot.color;
	ctx.beginPath();
	ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

/** @param {CanvasRenderingContext2D} ctx @param {LineMark} line */
function drawLine(ctx, line) {
	ctx.save();
	ctx.globalAlpha = line.opacity;
	ctx.strokeStyle = line.color;
	ctx.lineWidth = line.width;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.beginPath();
	const [first, ...rest] = line.points;
	ctx.moveTo(first.x, first.y);
	for (const point of rest) {
		ctx.lineTo(point.x, point.y);
	}
	ctx.stroke();
	ctx.restore();
}
