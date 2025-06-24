import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function extractLatLng(locationUrl) {
  // Simple parser for Google Maps long URL (can improve later)
  try {
    const match = locationUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  } catch (e) {
    console.error("Failed to extract lat/lng from locationUrl:", e);
  }
  return null;
}

export default function MapPage() {
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/approved")
      .then(res => {
        const parsed = res.data.map(p => {
          const coords = extractLatLng(p.location);
          return coords ? { ...p, ...coords } : null;
        }).filter(Boolean);
        setPlaces(parsed);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="h-screen w-full">
      <MapContainer center={[15.3173, 75.7139]} zoom={7} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place) => (
          <Marker key={place.id} position={[place.lat, place.lng]}>
            <Popup>
              <div className="text-center">
                <img
                  src={`http://localhost:5000${place.images[0]}`}
                  alt="thumb"
                  className="w-40 h-24 object-cover mb-2 rounded"
                />
                <h2 className="text-lg font-semibold">{place.title}</h2>
                <button
                  onClick={() => navigate(`/place/${place.id}`)}
                  className="text-blue-600 underline mt-2 block"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
