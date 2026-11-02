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
import PhotoDrawing from "@/components/PhotoDrawing";
import { DEFAULT_STYLE } from "@/styles";

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
				{photo && <PhotoDrawing file={photo} style={DEFAULT_STYLE} />}
			</div>
		</main>
	);
}

export default App;
