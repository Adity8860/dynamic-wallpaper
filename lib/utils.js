import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export async function downloadImage(event, imageUrl) {
  event.preventDefault();

  try {
    const url =
      imageUrl ||
      event.currentTarget.closest(".group")?.querySelector("img")?.src;

    if (!url) {
      console.error("Image URL not found");
      return;
    }

    // Fetch image data
    const response = await fetch(url, { mode: "cors" });

    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }

    // Convert response to Blob
    const blob = await response.blob();

    // Ensure MIME type is correct
    if (!blob.type.startsWith("image")) {
      throw new Error("Fetched data is not an image");
    }

    // Extract file extension and name
    const fileExtension = blob.type.split("/")[1] || "jpg";
    const filename = `downloaded_image.${fileExtension}`;

    // Create a temporary download link
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error downloading image:", error);
    alert(`Failed to download image: ${error.message}`);
  }
}
