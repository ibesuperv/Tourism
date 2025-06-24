import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const TempleModel = (props) => {
  const group = useRef();
  const { scene } = useGLTF("/AngkorWat.glb");

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      rotation={[0.008, 0, 0.001]} // slight tilt on X and Z axes
      scale={[0.5, 0.5, 0.5]}
    >
      <primitive object={scene} />
    </group>
  );
};

export default TempleModel;
