import React, { useRef } from 'react';
import { easing } from 'maath';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import { useSelector } from 'react-redux';
import { selectColor, selectIsFullTexture, selectIsLogoTexture, selectLogoDecal, selectFullDecal } from '../store';

const Shirt = () => {
  const meshRef = useRef();
  const { nodes, materials } = useGLTF('./shirt_baked.glb');

  // Get states from Redux
  const color = useSelector(selectColor);
  const isFullTexture = useSelector(selectIsFullTexture);
  const isLogoTexture = useSelector(selectIsLogoTexture);
  const logoDecal = useSelector(selectLogoDecal);
  const fullDecal = useSelector(selectFullDecal);

  // Load textures
  const logoTexture = useTexture(logoDecal);
  const fullTexture = useTexture(fullDecal);

  // Handle color change
  useFrame((state, delta) => {
    if (meshRef.current) {
      easing.dampC(materials.lambert1.color, color, 0.25, delta);
    }
  });

  // Log state for debugging
  console.log('Shirt State:', {
    Logo: isLogoTexture,
    Full: isFullTexture,
    Color: color
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {isFullTexture && (
          <Decal 
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}
        {isLogoTexture && (
          <Decal 
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
};

export default Shirt;