import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function forceDownloadBlob(url: string, filename = "download.mp4") {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");
    const blob = await res.blob();
    const blobURL = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(blobURL);
  } catch (error) {
    console.error("Download failed:", error);
    // Fallback to direct opening if blob download fails
    window.open(url, "_blank");
  }
}
