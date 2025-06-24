import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import TempleModel from "./TempleModel";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const sectionRef = useRef(null);

  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 60%", "end end"],
  });

  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  return (
    <div className="font-sans cursor-default">
      {/* Landing Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <Canvas
          className="absolute inset-0"
          camera={{ position: [0, 4, 25], fov: 45 }}
          style={{
            width: "100vw",
            height: "100vh",
            background: "linear-gradient(to bottom, #1e3c72 0%, #2a5298 100%)",
          }}
          shadows
        >
          <ambientLight intensity={0.6} />
          <spotLight
            position={[15, 30, 10]}
            angle={0.3}
            penumbra={1}
            intensity={1.5}
            castShadow
          />
          <directionalLight position={[-5, 10, 5]} intensity={1.2} castShadow />
          <Suspense fallback={null}>
            <Stage
              environment="sunset"
              intensity={0.5}
              shadows
              adjustCamera={false}
            >
              <TempleModel
                position={[0, -2, 0]}
                scale={2.5}
                rotation={[0, Math.PI / 6, 0]}
              />
            </Stage>
          </Suspense>
          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={1.2}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>

        <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />

        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-white text-center px-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8, y: -30 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 1 },
            }}
            whileHover={{
              scale: 1.05,
              textShadow: "0px 0px 15px rgba(255,255,255,0.8)",
              transition: { duration: 0.3 },
            }}
            className="text-6xl md:text-8xl font-extrabold tracking-tight mb-3"
          >
            PRAGYAA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.4, duration: 0.8 },
            }}
            className="text-lg md:text-2xl mb-6 font-light"
          >
            by <span className="font-semibold">TeamV</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.8, duration: 0.8 },
            }}
            className="flex gap-6"
          >
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 0px 20px rgba(234,179,8,0.6)",
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300"
              onClick={() => navigate("/explore")}
            >
              🚀 Explore
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 0px 20px rgba(255,255,255,0.4)",
              }}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-bold py-2 px-6 rounded-full border border-white/30 backdrop-blur-md transition-all duration-300"
              onClick={() => navigate("/contribute")}
            >
              🤝 Contribute
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Scroll-reveal Section with red scale-in from top-left */}
      <div
        ref={sectionRef}
        className="relative w-full h-screen overflow-hidden bg-white"
      >
        {/* Red expanding circle from top-left */}
        <motion.div
          style={{
            scale,
            background: "radial-gradient(circle at top left, #ff416c, #ff4b2b)",
          }}
          className="absolute top-0 left-0 w-1 h-1 bg-red-600 z-0 rounded-full"
          transformOrigin="top left"
        />

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          viewport={{ once: true }}
          className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-6 text-white"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Hidden Gems
          </h2>
          <p className="text-lg md:text-xl max-w-2xl">
            This project helps promote tourism by sharing lesser-known places
            through photos and stories. Contribute to rural development and
            cultural pride by adding your own discoveries.
          </p>
          <div className="mt-10 p-6 bg-white bg-opacity-10 border border-white/30 rounded-lg backdrop-blur-md">
            <h3 className="text-2xl font-semibold mb-2 text-white">
              NSS: "Not Me, But You"
            </h3>
            <p className="text-white text-sm max-w-xl">
              Our project aligns with the National Service Scheme by encouraging
              youth to serve society, preserve heritage, and connect India
              through tourism and awareness.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
