import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_CREDENTIALS = {
  email: "varunb5725@gmail.com",
  password: "123456",
};

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [submissions, setSubmissions] = useState([]);
  const [previewImg, setPreviewImg] = useState(null);

  const handleLogin = () => {
    if (
      loginData.email === ADMIN_CREDENTIALS.email &&
      loginData.password === ADMIN_CREDENTIALS.password
    ) {
      setLoggedIn(true);
      fetchSubmissions();
    } else {
      alert("Invalid credentials");
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/submissions");
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.post("http://localhost:5000/update-status", { id, status });
      fetchSubmissions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-yellow-100">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm"
        >
          <div className="flex justify-center mb-4">
            <svg width="40" height="40" fill="currentColor" className="text-blue-600">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">Admin Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 mb-3 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 mb-4 rounded"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          >
            Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-white via-blue-50 to-yellow-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
          🛠 Admin Panel
        </h1>
        <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          Total: {submissions.length}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {submissions.map((sub) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-4 space-y-3 hover:shadow-xl transition"
            >
              <h2 className="text-xl font-bold text-gray-800">{sub.title}</h2>
              <p className="text-gray-700">{sub.description}</p>
              <a
                href={sub.location}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                📍 View Location
              </a>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {sub.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:5000${img}`}
                    alt={`img-${idx}`}
                    className="w-full h-28 object-cover rounded cursor-pointer"
                    onClick={() => setPreviewImg(`http://localhost:5000${img}`)}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => handleStatusUpdate(sub.id, "approved")}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(sub.id, "rejected")}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  ❌ Reject
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Full screen image preview */}
      {previewImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setPreviewImg(null)}
        >
          <img src={previewImg} alt="Preview" className="max-h-[90vh] rounded shadow-xl" />
        </div>
      )}
    </div>
  );
}
