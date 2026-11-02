import { useEffect, useRef } from "react";
import { drawMarks } from "@/lib/marks";
import { PAPER_COLOR } from "@/lib/paper";

/**
 * A sheet of paper with marks (strokes, dots…) drawn on it.
 * @param {{ width: number, height: number, marks: import("@/lib/marks").Mark[], base?: ImageData }} props
 */
function DrawingCanvas({ width, height, marks, base }) {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");

		if (base) {
			ctx.putImageData(base, 0, 0);
		} else {
			ctx.fillStyle = `rgb(${PAPER_COLOR.red} ${PAPER_COLOR.green} ${PAPER_COLOR.blue})`;
			ctx.fillRect(0, 0, width, height);
		}
		drawMarks(ctx, marks);
	}, [height, width, marks, base]);

	return <canvas ref={canvasRef} className="w-full h-auto rounded-2xl" />;
}

export default DrawingCanvas;
