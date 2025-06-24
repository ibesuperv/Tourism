import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Contribute from "./pages/Contribute";
import Admin from "./pages/Admin";
import Landing from "./components/Landing";
import PlaceDetails from "./pages/PlaceDetails";
import MapPage from "./pages/MapPage";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* No navbar for Landing */}
        <Route path="/" element={<Landing />} />

        {/* Routes with navbar */}
        <Route element={<MainLayout />}>
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/explore" element={<MapPage />} />
          <Route path="/place/:id" element={<PlaceDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
