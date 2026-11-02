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

function previewAnalysis(imageData) {
	return blur(grayscale(imageData), 10);
}

const TEST_MARKS = [
	{
		type: "line",
		points: [
			{ x: 40, y: 60 },
			{ x: 560, y: 60 },
		],
		width: 2,
		color: "#2b2b2b",
		opacity: 1,
	},
	{
		type: "line",
		points: [
			{ x: 40, y: 60 },
			{ x: 170, y: 90 },
			{ x: 300, y: 30 },
			{ x: 430, y: 90 },
			{ x: 560, y: 60 },
		],
		width: 4,
		color: "#2b2b2b",
		opacity: 0.5,
	},
	{
		type: "dot",
		x: 200,
		y: 100,
		radius: 20,
		color: "#FF0000",
		opacity: 1,
	},
	{
		type: "dot",
		x: 50,
		y: 50,
		radius: 10,
		color: "#3700FF",
		opacity: 1,
	},
	{
		type: "dot",
		x: 100,
		y: 100,
		radius: 5,
		color: "#22FF00",
		opacity: 1,
	},
];

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

				<DrawingCanvas width={600} height={400} marks={TEST_MARKS} />
			</div>
		</main>
	);
}

export default App;
