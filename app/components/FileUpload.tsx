"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import axios from "axios";
import { useRef, useState } from "react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  //validation

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please select a video file");
      }
    }
    if (fileType === "image") {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size should be less than 100MB");
    }
    return true;
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files?.[0];

    if (!file || !validateFile(file)) {
      return;
    }
    setUploading(true);
    try {
      const authRes = await axios.get("/api/auth/imagekit");
      console.log(authRes);
      const uploadResponse = await upload({
        // Authentication parameters
        file,
        fileName: file.name,
        expire: authRes.data.expire,
        token: authRes.data.token,
        signature: authRes.data.signature,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,

        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(Math.round(progress));
          }
        },
      });
      onSuccess(uploadResponse);
    } catch (e) {
      console.log("upload error", e);
    } finally{
      setUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept="{fileType === 'video' ? 'video/*' : 'image/*'}"
        onChange={handleFileChange}
      />
      {uploading && <span>Uploading..</span>}
    </>
  );
};
export default FileUpload;
