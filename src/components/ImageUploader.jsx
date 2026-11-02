import { useRef, useState } from "react";
import { cn } from "cn";
import { ImageIcon, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { validateImageFile } from "@/lib/image";

/**
 * Lets the user pick a photo from their device.
 * It doesn't keep the file: it hands it to the parent through `onSelect`.
 */
function ImageUploader({ onSelect }) {
	const inputRef = useRef(null);
	const [isDragging, setIsDragging] = useState(false);
	const [error, setError] = useState(null);

	// Single entry point: both the button and the drop zone go through here
	function selectFile(file) {
		if (file) {
			const message = validateImageFile(file);
			setError(message);
			if (message === null) {
				onSelect(file);
			}
		}
	}

	function openFilePicker() {
		inputRef.current.click();
	}

	function handleChange(event) {
		const file = event.target.files[0];
		selectFile(file);
		event.target.value = "";
	}

	// Fires over and over while something is dragged over the drop zone
	function handleDragOver(event) {
		event.preventDefault();
		setIsDragging(true);
	}

	// Fires when the drag leaves the drop zone... or moves onto one of its children
	function handleDragLeave(event) {
		if (event.currentTarget.contains(event.relatedTarget)) {
			return;
		}
		setIsDragging(false);
	}

	function handleDrop(event) {
		event.preventDefault();
		setIsDragging(false);

		const file = event.dataTransfer.files[0];
		selectFile(file);
	}

	return (
		<>
			<Empty
				className={cn(
					"border border-dashed transition-colors",
					isDragging && "border-primary bg-muted",
				)}
				onDrop={handleDrop}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
			>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<ImageIcon />
					</EmptyMedia>
					<EmptyTitle>Upload a photo</EmptyTitle>
					<EmptyDescription>
						Drag and drop a photo here, or use the button. It never
						leaves your device.
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
			{error !== null && (
				<Alert variant="destructive">
					<AlertCircleIcon />
					<AlertTitle>Can't use this file</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
		</>
	);
}

export default ImageUploader;
