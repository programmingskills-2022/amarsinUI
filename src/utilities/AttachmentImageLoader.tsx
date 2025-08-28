import React, { useState, useEffect, useRef } from "react";
//import Skeleton from "../components/layout/Skeleton";
import Spinner from "../components/controls/Spinner";

interface ImageOptions {
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
  id?: string;
  placeholder?: string;
  onError?: (error: Error) => void;
  clickable?: boolean; // New option to control clickability
}

interface AttachmentImageLoaderProps {
  authToken: string;
  imageUrl: string;
  options?: ImageOptions;
}

const AttachmentImageLoader: React.FC<AttachmentImageLoaderProps> = ({
  authToken,
  imageUrl,
  options = {},
}) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  // Default to true for clickable images
  const isClickable = options.clickable !== false;

  const handleImageClick = () => {
    if (!isClickable || !imgSrc) return;

    // Open image in new window/tab
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>تصویر </title>
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
                        <img src="${imgSrc}" alt="تصویر چک" />
                    </div>
                </body>
                </html>
            `);
      newWindow.document.close();
    }
  };

  useEffect(() => {
    // Reset the image source when dependencies change
    setImgSrc(null);
    // Clean up previous blob URL
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    const loadImage = async () => {
      // Reset error state
      setError(null);
      console.log(imageUrl, "imageUrl in loadImage");

      try {
        //console.log(imageUrl, "imageUrl");

        // Use fetch instead of axios for better blob handling
        const response = await fetch(imageUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "image/*",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Convert response to blob
        const blob = await response.blob();

        // Check if blob is valid
        if (!blob || blob.size === 0) {
          throw new Error("Invalid or empty image data received");
        }

        const objectUrl = URL.createObjectURL(blob);

        // Store the blob URL reference for cleanup
        blobUrlRef.current = objectUrl;

        // Set the blob URL to state
        setImgSrc(objectUrl);
      } catch (err) {
        console.error("Error loading authenticated image:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        if (options.onError)
          options.onError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    loadImage();

    // Cleanup function
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [authToken, imageUrl, options]);

  if (error) {
    return (
      <div className="text-red-500">خطای بارگذاری تصویر : {error.message}</div>
    );
  }

  if (!imgSrc) {
    return <Spinner />;
  }

  return (
    <img
      loading="lazy"
      ref={imgRef}
      src={imgSrc}
      className={options.className}
      alt={options.alt || "Attachment Image"}
      style={{
        ...options.style,
        cursor: isClickable ? "pointer" : "default",
      }}
      id={options.id}
      onClick={handleImageClick}
      onError={() => {
        const err = new Error("Failed to load image from blob URL");
        setError(err);
        if (options.onError) options.onError(err);
      }}
    />
  );
};

export default AttachmentImageLoader;
