"use client";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Camera, Upload, X } from "lucide-react";

interface PhotoUploadProps {
  onImageCapture?: (file: File, preview: string) => void;
  className?: string;
}

export default function PhotoUpload({
  onImageCapture,
  className = "",
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      if (onImageCapture && file) {
        onImageCapture(file, result);
      }
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-full flex justify-center items-center p-8 border-2 border-dashed rounded-lg bg-muted/30 relative">
        {preview ? (
          <div className="relative w-full max-w-md">
            <img
              src={preview}
              alt="Ingredient list preview"
              className="w-full rounded-md object-contain max-h-[300px]"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">
              Take a photo of ingredients
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Snap a clear photo of the ingredient list
            </p>
            <div className="mt-4 flex gap-2 justify-center">
              <Button
                onClick={handleCameraClick}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Camera className="h-4 w-4" />
                {isLoading ? "Processing..." : "Take Photo"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCameraClick}
                disabled={isLoading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );
}
