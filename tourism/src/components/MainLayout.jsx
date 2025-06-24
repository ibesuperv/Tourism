// src/components/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="pt-20 px-4"> {/* pt-20 = 80px height of navbar */}
        <Outlet />
      </main>
    </>
  );
}
