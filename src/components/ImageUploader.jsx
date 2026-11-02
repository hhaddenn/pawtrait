import { useRef } from "react";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

/**
 * Lets the user pick a photo from their device.
 * It doesn't keep the file: it hands it to the parent through `onSelect`.
 */
function ImageUploader({ onSelect }) {
	const inputRef = useRef(null);

	function openFilePicker() {
		inputRef.current.click();
	}

	function handleChange(event) {
		const file = event.target.files[0];
		if (file) {
			onSelect(file);
		}
		event.target.value = "";
	}

	return (
		<Empty className="border border-dashed">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<ImageIcon />
				</EmptyMedia>
				<EmptyTitle>Upload a photo</EmptyTitle>
				<EmptyDescription>
					The photo never leaves the device.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button size="lg" onClick={openFilePicker}>
					Upload photo
				</Button>
				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					onChange={handleChange}
					hidden
				/>
			</EmptyContent>
		</Empty>
	);
}

export default ImageUploader;
