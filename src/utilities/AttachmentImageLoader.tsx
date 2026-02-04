import React, { useState, useEffect, useRef, useMemo } from "react";
//import Skeleton from "../components/layout/Skeleton";
import Spinner from "../components/controls/Spinner";
import Button from "../components/controls/Button";

type FileType = "image" | "pdf" | "word" | "excel" | "powerpoint" | "other";

interface AttachmentOptions {
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
  id?: string;
  placeholder?: string;
  onError?: (error: Error) => void;
  clickable?: boolean; // New option to control clickability
  fileExtension?: string; // Optional file extension to determine file type
}

interface AttachmentImageLoaderProps {
  authToken: string;
  imageUrl: string;
  options?: AttachmentOptions;
}

// Helper function to determine file type from extension
const getFileTypeFromExtension = (
  extension: string | undefined,
  mimeType: string,
  url?: string
): FileType => {
  if (extension) {
    const ext = extension.toLowerCase().replace(/^\./, ""); // Remove leading dot
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext)) {
      return "image";
    }
    if (ext === "pdf") return "pdf";
    if (["doc", "docx"].includes(ext)) return "word";
    if (["xls", "xlsx"].includes(ext)) return "excel";
    if (["ppt", "pptx"].includes(ext)) return "powerpoint";
  }

  // Fallback to MIME type detection
  if (mimeType && mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.includes("wordprocessingml") || mimeType.includes("msword"))
    return "word";
  if (mimeType.includes("spreadsheetml") || mimeType.includes("excel"))
    return "excel";
  if (mimeType.includes("presentationml") || mimeType.includes("powerpoint"))
    return "powerpoint";

  // Additional fallback: check if URL contains "image" in the path
  // This helps when the API endpoint is for images but doesn't have extension
  if (url && (url.includes("/image/") || url.includes("/Image/"))) {
    return "image";
  }

  // Default to "other" if we can't determine
  return "other";
};

// Helper function to extract extension from URL
const getExtensionFromUrl = (url: string): string | undefined => {
  try {
    const urlPath = new URL(url).pathname;
    const match = urlPath.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1] : undefined;
  } catch {
    // If URL parsing fails, try simple regex
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1] : undefined;
  }
};

const AttachmentImageLoader: React.FC<AttachmentImageLoaderProps> = ({
  authToken,
  imageUrl,
  options = {},
}) => {
  const [fileSrc, setFileSrc] = useState<string | null>(null);
  const [fileType, setFileType] = useState<FileType>("image");
  const [error, setError] = useState<Error | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const blobUrlRef = useRef<string | null>(null);
  const previousImageUrlRef = useRef<string | null>(null);

  // Memoize options to prevent infinite re-renders (for rendering only, not for fetching)
  const memoizedOptions = useMemo(
    () => options,
    [
      options.className,
      options.alt,
      options.id,
      options.placeholder,
      options.clickable,
      options.style,
      options.fileExtension,
    ]
  );

  // Default to true for clickable images/files
  const isClickable = memoizedOptions.clickable !== false;

  const handleFileClick = () => {
    if (!isClickable || !fileSrc) return;

    if (fileType === "image") {
      // Open image in new window/tab
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
              <title>تصویر</title>
              <style>
                  body {
                      margin: 0;
                      padding: 20px;
                      background-color: #f5f5f5;
                      font-family: Arial, sans-serif;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      min-height: 100vh;
                  }
                  .image-container {
                      max-width: 95vw;
                      max-height: 95vh;
                      text-align: center;
                  }
                  img {
                      max-width: 100%;
                      max-height: 100%;
                      object-fit: contain;
                      border: 1px solid #ddd;
                      border-radius: 4px;
                      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                  }
                  .close-button {
                      position: fixed;
                      top: 10px;
                      right: 10px;
                      background: #ff4444;
                      color: white;
                      border: none;
                      padding: 8px 12px;
                      border-radius: 4px;
                      cursor: pointer;
                      font-size: 14px;
                  }
                  .close-button:hover {
                      background: #cc0000;
                  }
              </style>
          </head>
          <body>
              <button class="close-button" onclick="window.close()"> &times;</button>
              <div class="image-container">
                  <img src="${fileSrc}" alt="تصویر" />
              </div>
          </body>
          </html>
        `);
        newWindow.document.close();
      }
    } else {
      // For other file types, open in new tab
      window.open(fileSrc, "_blank");
    }
  };

  const handleDownload = () => {
    if (!fileSrc) return;
    const link = document.createElement("a");
    link.href = fileSrc;
    link.download = ""; // Let browser determine filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    // Don't fetch if imageUrl is empty or invalid
    if (!imageUrl || !authToken) {
      setFileSrc(null);
      previousImageUrlRef.current = null;
      return;
    }

    // Only fetch if imageUrl has actually changed
    if (previousImageUrlRef.current === imageUrl) {
      // Image URL hasn't changed, don't refetch
      return;
    }

    // Update the previous imageUrl reference
    previousImageUrlRef.current = imageUrl;

    // Reset the file source when imageUrl changes
    setFileSrc(null);
    setFileType("image");
    // Clean up previous blob URL (only if it's different from current)
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    const loadFile = async () => {
      // Reset error state
      setError(null);

      try {
        // Determine file extension from options or URL
        const extension =
          memoizedOptions.fileExtension || getExtensionFromUrl(imageUrl);

        // Use fetch instead of axios for better blob handling
        // Accept all file types, not just images
        const response = await fetch(imageUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Convert response to blob
        const blob = await response.blob();

        // Check if blob is valid
        if (!blob || blob.size === 0) {
          throw new Error("Invalid or empty file data received");
        }

        // Double-check that imageUrl hasn't changed during the fetch
        if (previousImageUrlRef.current !== imageUrl) {
          // Image URL changed during fetch, don't set the result
          return;
        }

        // Detect file type from extension, MIME type, or URL pattern
        let detectedFileType = getFileTypeFromExtension(extension, blob.type, imageUrl);
        
        // If blob type is empty/unknown but URL contains "/image/", assume it's an image
        // This handles cases where the API endpoint is for images but doesn't set proper Content-Type
        if (detectedFileType === "other" && (imageUrl.includes("/image/") || imageUrl.includes("/Image/"))) {
          detectedFileType = "image";
        }
        
        setFileType(detectedFileType);

        const objectUrl = URL.createObjectURL(blob);
        // Store the blob URL reference for cleanup
        blobUrlRef.current = objectUrl;

        // Set the blob URL to state
        setFileSrc(objectUrl);
      } catch (err) {
        console.error("Error loading authenticated file:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        if (options.onError)
          options.onError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    loadFile();

    // Cleanup function - only runs when imageUrl or authToken changes
    return () => {
      // Cleanup will be handled by the next effect run or unmount effect below
    };
  }, [authToken, imageUrl]); // Removed memoizedOptions - only refetch when imageUrl or authToken changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <div className="text-red-500">خطای بارگذاری فایل : {error.message}</div>
    );
  }

  if (!fileSrc) {
    return <Spinner />;
  }

  // Render based on file type
  if (fileType === "image") {
    return (
      <img
        loading="lazy"
        ref={imgRef}
        src={fileSrc}
        className={memoizedOptions.className}
        alt={memoizedOptions.alt || "Attachment Image"}
        style={{
          ...memoizedOptions.style,
          cursor: isClickable ? "pointer" : "default",
        }}
        id={memoizedOptions.id}
        onClick={handleFileClick}
        onError={() => {
          const err = new Error("Failed to load image from blob URL");
          setError(err);
          if (options.onError) options.onError(err);
        }}
      />
    );
  }

  if (fileType === "pdf") {
    return (
      <div className="w-full h-full flex flex-col">
        <iframe
          src={fileSrc}
          className={`w-full flex-1 border ${memoizedOptions.className || ""}`}
          style={{
            minHeight: "400px",
            height: "100%",
            ...memoizedOptions.style,
          }}
          title="PDF Viewer"
          id={memoizedOptions.id}
        />
        {isClickable && (
          <Button text="دانلود فایل" onClick={handleDownload} variant="outline" />
        )}
      </div>
    );
  }

  // For Office files and other types, show download option
  if (
    fileType === "word" ||
    fileType === "excel" ||
    fileType === "powerpoint" ||
    fileType === "other"
  ) {
    const fileTypeNames: Record<FileType, string> = {
      word: "Word",
      excel: "Excel",
      powerpoint: "PowerPoint",
      other: "فایل",
      image: "",
      pdf: "",
    };

    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4 border rounded">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">
            {fileType !== "other"
              ? `فایل ${fileTypeNames[fileType]}`
              : "فایل ضمیمه"}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            این نوع فایل در مرورگر قابل نمایش نیست
          </p>
        </div>
        <Button text="دانلود فایل" onClick={handleDownload} variant="outline" />
        {/*isClickable && (
          <button
            onClick={handleFileClick}
            className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            باز کردن در تب جدید
          </button>
        )}*/}
      </div>
    );
  }

  // Fallback (should not reach here)
  return <div>نوع فایل پشتیبانی نمی‌شود</div>;
};

export default AttachmentImageLoader;
