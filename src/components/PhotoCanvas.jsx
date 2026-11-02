import { useEffect, useRef } from "react";
import { MAX_WIDTH, fitToWidth, loadBitmap } from "@/lib/image";

/**
 * Draws the chosen photo on a canvas, upright and at most MAX_WIDTH pixels wide.
 */
function PhotoCanvas({ file }) {
	const canvasRef = useRef(null);

	useEffect(() => {
		// The effect itself can't be async, so the async work lives in this inner function
		async function draw() {
			const bitmap = await loadBitmap(file);
			const size = fitToWidth(bitmap.width, bitmap.height, MAX_WIDTH);

			const canvas = canvasRef.current;

			canvas.width = size.width;
			canvas.height = size.height;

			const ctx = canvas.getContext("2d");

			ctx.drawImage(bitmap, 0, 0, size.width, size.height);

			bitmap.close();
		}

		draw();
	}, [file]);

	return <canvas ref={canvasRef} className="w-full h-auto rounded-2xl" />;
}

export default PhotoCanvas;
