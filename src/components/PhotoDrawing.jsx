import { useEffect, useState } from "react";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DrawingCanvas from "@/components/DrawingCanvas";
import { loadImageData } from "@/lib/image";

/**
 * Turns a photo into a drawing: reads its pixels, runs a style on them and draws the resulting marks.
 * @param {{ file: File, style: import("@/styles").Style }} props
 */
function PhotoDrawing({ file, style }) {
	const [drawing, setDrawing] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let ignore = false;

		async function prepare() {
			try {
				const imageData = await loadImageData(file);
				if (ignore) {
					return;
				}
				const { base, marks } = style.draw(imageData);
				setDrawing({
					width: imageData.width,
					height: imageData.height,
					base,
					marks,
				});
				setError(null);
			} catch {
				if (!ignore) {
					setError("The file may be damaged. Try another one.");
					setDrawing(null);
				}
			}
		}

		prepare();

		return () => {
			ignore = true;
		};
	}, [file, style]);

	return (
		<>
			{error !== null && (
				<Alert variant="destructive">
					<AlertCircleIcon />
					<AlertTitle>Can't open this photo</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			{drawing !== null && (
				<DrawingCanvas
					width={drawing.width}
					height={drawing.height}
					base={drawing.base}
					marks={drawing.marks}
				/>
			)}
		</>
	);
}

export default PhotoDrawing;
