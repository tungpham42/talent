export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "talent"); // setup in Cloudinary
  const res = await fetch("https://api.cloudinary.com/v1_1/filecuatui/upload", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.secure_url;
};
