import { useEffect, useRef } from "react";
import { drawMarks } from "@/lib/marks";

// The colour of the "paper" the cat draws on
const PAPER_COLOR = "#fdfbf7";

/**
 * A sheet of paper with marks (strokes, dots…) drawn on it.
 * @param {{ width: number, height: number, marks: import("@/lib/marks").Mark[] }} props
 */
function DrawingCanvas({ width, height, marks }) {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = PAPER_COLOR;
		ctx.fillRect(0, 0, width, height);
		drawMarks(ctx, marks);
	}, [height, width, marks]);

	return <canvas ref={canvasRef} className="w-full h-auto rounded-2xl" />;
}

export default DrawingCanvas;
