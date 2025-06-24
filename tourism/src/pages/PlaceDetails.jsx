import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { motion } from "framer-motion";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function extractLatLng(locationUrl) {
  const match = locationUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  return null;
}

export default function PlaceDetails() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/approved")
      .then((res) => {
        const found = res.data.find((p) => p.id === id);
        setPlace(found);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!place) return <div className="p-8 text-center">Loading...</div>;

  const coords = extractLatLng(place.location);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-white to-blue-50 p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-blue-800 mb-3">{place.title}</h1>
        <p className="text-gray-700 mb-6">{place.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {place.images.map((img, i) => (
            <motion.img
              key={i}
              src={`http://localhost:5000${img}`}
              alt={`img-${i}`}
              className="w-full h-48 object-cover rounded-lg cursor-pointer shadow"
              whileHover={{ scale: 1.05 }}
              onClick={() => setPreviewImg(`http://localhost:5000${img}`)}
            />
          ))}
        </div>

        {coords ? (
          <>
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={13}
              className="w-full h-96 rounded shadow"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>{place.title}</Popup>
              </Marker>
            </MapContainer>

            <div className="mt-4 text-right">
              <a
                href={place.location}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-600 font-medium underline hover:text-blue-800 transition"
              >
                📍 View in Google Maps
              </a>
            </div>
          </>
        ) : (
          <p className="text-red-500">Location preview unavailable.</p>
        )}
      </div>

      {/* Preview Modal */}
      {previewImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setPreviewImg(null)}
        >
          <img
            src={previewImg}
            alt="Full Preview"
            className="max-h-[90vh] rounded-lg shadow-2xl"
          />
        </div>
      )}
    </motion.div>
  );
}
