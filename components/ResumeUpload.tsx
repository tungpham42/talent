"use client";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useState } from "react";

export default function ResumeUpload({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadToCloudinary(file);
    setUploading(false);
    onUpload(url);
  };

  return (
    <div>
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleChange} />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
