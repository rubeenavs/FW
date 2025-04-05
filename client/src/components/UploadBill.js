import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadBill = ({ userId }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("billImage", file);

    try {
      setUploading(true);
      const response = await axios.post(
        `http://localhost:5000/api/ocr/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      navigate("/review-bill", { state: { extractedData: data.items } });
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Upload Grocery Bill</h2>

      <div style={styles.uploadBox}>
        <div style={styles.inputWrapper}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={styles.input}
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          style={styles.button}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    marginBottom: "30px",
    textAlign: "center",
  },
  heading: {
    color: "#f5f5dc",
    fontSize: "24px",
    marginBottom: "15px",
  },
  uploadBox: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    maxWidth: "400px",
    margin: "0 auto",
    backgroundColor: "#2c3e3f",
  },
  inputWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
    maxWidth: "300px",
    backgroundColor: "#f5f5dc", // same as heading color
    color: "#000",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#2e856e",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default UploadBill;
