import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Contribute() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    images: [],
  });

  const [status, setStatus] = useState(null); // success / error
  const [submissionId, setSubmissionId] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData({ ...formData, images: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      formData.images.length === 0
    ) {
      setStatus("error");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("location", formData.location);
    formData.images.forEach((img) => data.append("images", img));

    try {
      const res = await axios.post("http://localhost:5000/submit", data);
      setStatus("success");
      setSubmissionId(res.data.id);
      setFormData({ title: "", description: "", location: "", images: [] });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-blue-100 to-green-100 p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-xl shadow-xl mx-auto p-8 w-full max-w-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-blue-900">
          📍 Contribute a Place in Karnataka
        </h2>

        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Hampi – The Ancient Capital of Vijayanagara"
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the place and why it's special..."
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Location (Google Maps URL)
          </label>
          <input
            type="url"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="https://maps.app.goo.gl/..."
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Upload Images</label>
          <div
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);
              setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...files],
              }));
            }}
            onDragOver={(e) => e.preventDefault()}
            className="w-full border-2 border-dashed border-blue-400 rounded p-6 text-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <p className="text-gray-700">
              📂 Drag & drop images here or click to select
            </p>
            <input
              type="file"
              id="fileInput"
              name="images"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="hidden"
            />
          </div>

          {/* Image Previews */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {formData.images.map((img, i) => (
                <div
                  key={i}
                  className="w-full h-24 overflow-hidden rounded shadow"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview-${i}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
        >
          🚀 Submit
        </motion.button>

        {/* Submission Status */}
        {status === "success" && (
          <p className="text-green-600 font-medium text-center">
            ✅ Submitted successfully! Your ID:{" "}
            <span className="font-bold">{submissionId}</span>
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 font-medium text-center">
            ⚠️ Please fill all fields and try again.
          </p>
        )}
      </motion.form>
    </div>
  );
}
