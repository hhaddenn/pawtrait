import { useEffect, useRef, useState } from "react";
import { cn } from "cn";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MAX_WIDTH, fitToWidth, loadBitmap } from "@/lib/image";

/**
 * Draws the chosen photo on a canvas, upright and at most MAX_WIDTH pixels wide.
 * If a filter is given, it's applied to the pixels before showing them.
 */
function PhotoCanvas({ file, filter }) {
	const canvasRef = useRef(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let ignore = false;

		// The effect itself can't be async, so the async work lives in this inner function
		async function draw() {
			try {
				const bitmap = await loadBitmap(file);

				if (ignore) {
					bitmap.close();
					return;
				}

				const size = fitToWidth(bitmap.width, bitmap.height, MAX_WIDTH);

				const canvas = canvasRef.current;

				canvas.width = size.width;
				canvas.height = size.height;

				const ctx = canvas.getContext("2d", {
					willReadFrequently: true,
				});

				ctx.drawImage(bitmap, 0, 0, size.width, size.height);

				bitmap.close();

				if (filter) {
					const imageData = ctx.getImageData(
						0,
						0,
						size.width,
						size.height,
					);
					const result = filter(imageData);
					ctx.putImageData(result, 0, 0);
				}

				setError(null);
			} catch {
				if (!ignore) {
					setError("The file may be damaged. Try another one.");
				}
			}
		}

		draw();

		return () => {
			ignore = true;
		};
	}, [file, filter]);

	return (
		<>
			{error !== null && (
				<Alert variant="destructive">
					<AlertCircleIcon />
					<AlertTitle>Can't open this photo</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<canvas
				ref={canvasRef}
				className={cn(
					"w-full h-auto rounded-2xl",
					error !== null && "hidden",
				)}
			/>
		</>
	);
}

export default PhotoCanvas;
