import React, { useRef, useEffect } from 'react';
import { easing } from 'maath';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import { useSelector } from 'react-redux';
import { selectColor, selectIsFullTexture, selectIsLogoTexture, selectLogoDecal, selectFullDecal } from '../store';

const Hoodie = () => {
  const meshRef = useRef();
  const { nodes, materials } = useGLTF('./hoodie.glb');

  // Debug log to see the model structure
  useEffect(() => {
    console.log('Hoodie Model:', { nodes, materials });
  }, [nodes, materials]);

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
    if (meshRef.current && materials) {
      // Get the first material if default doesn't exist
      const material = Object.values(materials)[0];
      if (material) {
        easing.dampC(material.color, color, 0.25, delta);
      }
    }
  });

  // Find the first available mesh geometry
  const modelGeometry = nodes ? Object.values(nodes).find(node => node.geometry)?.geometry : null;

  if (!modelGeometry) {
    console.error('No geometry found in the hoodie model');
    return null;
  }

  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      <mesh
        ref={meshRef}
        castShadow
        geometry={modelGeometry}
        material={Object.values(materials)[0]}
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

// Preload the model
useGLTF.preload('./hoodie.glb');

export default Hoodie;