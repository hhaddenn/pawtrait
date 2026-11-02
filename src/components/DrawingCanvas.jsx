import { useEffect, useRef } from "react";
import { drawMarks } from "@/lib/marks";

// TODO 6: delete this constant and import PAPER_COLOR from "@/lib/paper" instead (one paper colour for the whole app)
// The colour of the "paper" the cat draws on
const PAPER_COLOR = "#fdfbf7";

/**
 * A sheet of paper with marks (strokes, dots…) drawn on it.
 * TODO 7: document the new optional prop: base (an ImageData drawn under the marks, e.g. the paper grain)
 * @param {{ width: number, height: number, marks: import("@/lib/marks").Mark[] }} props
 */
// TODO 8: receive the new `base` prop
function DrawingCanvas({ width, height, marks }) {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");

		// TODO 9: paint the bottom layer:
		//   - if there is a base → ctx.putImageData(base, 0, 0)
		//   - otherwise → the plain paper colour, as now. PAPER_COLOR is now an object, so build the CSS colour:
		//     `rgb(${PAPER_COLOR.red} ${PAPER_COLOR.green} ${PAPER_COLOR.blue})`
		ctx.fillStyle = PAPER_COLOR;
		ctx.fillRect(0, 0, width, height);
		drawMarks(ctx, marks);
		// TODO 10: add base to the dependencies
	}, [height, width, marks]);

	return <canvas ref={canvasRef} className="w-full h-auto rounded-2xl" />;
}

export default DrawingCanvas;
