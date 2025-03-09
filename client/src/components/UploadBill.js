import React, { useState } from "react";
import axios from "axios";

const UploadBill = ({userId}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("billImage", file); // The key must match the Multer field name

    try {
      setUploading(true);
      const response = await axios.post(`http://localhost:5000/api/ocr/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setExtractedText(response.data.text);
      setUploading(false);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload Grocery Bill</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {extractedText && (
        <div>
          <h3>Extracted Text:</h3>
          <pre>{extractedText}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadBill;
