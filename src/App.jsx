import { useState } from "react";
import { ImageIcon, XIcon } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import {
	Attachment,
	AttachmentAction,
	AttachmentActions,
	AttachmentContent,
	AttachmentDescription,
	AttachmentMedia,
	AttachmentTitle,
} from "@/components/ui/attachment";
import PhotoCanvas from "@/components/PhotoCanvas";
import { grayscale, blur } from "@/lib/pixels";
import DrawingCanvas from "@/components/DrawingCanvas";
import { createRandom, randomBetween } from "@/lib/random";

function previewAnalysis(imageData) {
	return blur(grayscale(imageData), 10);
}

/**
 * Temporary test: lots of short random pencil strokes, always the same ones for the same seed.
 * (from 4.5 on, the marks come from the pencil style)
 */
function makeScribbles(seed) {
	const random = createRandom(seed);
	const marks = [];

	for (let i = 0; i < 300; i += 1) {
		const x = randomBetween(random, 0, 600);
		const y = randomBetween(random, 0, 400);
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

	return marks;
}

const SCRIBBLE_MARKS = makeScribbles(42);

function toMegabytes(bytes) {
	return (bytes / 1048576).toFixed(1);
}

function toTypeLabel(mimeType) {
	return mimeType.split("/")[1].toUpperCase();
}

function App() {
	const [photo, setPhoto] = useState(null);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
			<h1 className="text-5xl font-bold text-orange-400">Pawtrait</h1>

			<div className="flex w-full max-w-md flex-col gap-4">
				<ImageUploader
					onSelect={(file) => {
						setPhoto(file);
					}}
				/>

				{/* Only shown once a photo has been chosen */}
				{photo && (
					<Attachment>
						<AttachmentMedia>
							<ImageIcon />
						</AttachmentMedia>
						<AttachmentContent>
							<AttachmentTitle>{photo.name}</AttachmentTitle>
							<AttachmentDescription>
								{toTypeLabel(photo.type)} ·{" "}
								{toMegabytes(photo.size)} MB
							</AttachmentDescription>
						</AttachmentContent>
						<AttachmentActions>
							<AttachmentAction
								aria-label={`Remove ${photo.name}`}
								onClick={() => {
									setPhoto(null);
								}}
							>
								<XIcon />
							</AttachmentAction>
						</AttachmentActions>
					</Attachment>
				)}

				{/* Only shown once a photo has been chosen */}
				{photo && <PhotoCanvas file={photo} filter={previewAnalysis} />}

				<DrawingCanvas
					width={600}
					height={400}
					marks={SCRIBBLE_MARKS}
				/>
			</div>
		</main>
	);
}

export default App;
