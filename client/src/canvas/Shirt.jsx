import React, { useEffect, useState } from 'react';
import { easing } from 'maath';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import { useSelector } from 'react-redux';
import { 
  selectColor, 
  selectIsFullTexture, 
  selectIsLogoTexture, 
  selectLogoDecal, 
  selectFullDecal,
  selectTextureScale,
  selectTexturePosition,
  selectClipMask
} from '../store';

const Shirt = () => {
  const [meshGeometry, setMeshGeometry] = useState(null);
  const color = useSelector(selectColor);
  const isFullTexture = useSelector(selectIsFullTexture);
  const isLogoTexture = useSelector(selectIsLogoTexture);
  const logoDecal = useSelector(selectLogoDecal);
  const fullDecal = useSelector(selectFullDecal);
  const textureScale = useSelector(selectTextureScale);
  const texturePosition = useSelector(selectTexturePosition);
  const clipMask = useSelector(selectClipMask);

  const { nodes, materials } = useGLTF('./models/shirt_baked.glb');

  useEffect(() => {
    if (!nodes) return;
    // Find the first mesh geometry in the nodes
    const shirtGeometry = Object.values(nodes).find(node => node.geometry)?.geometry;
    if (shirtGeometry) {
      setMeshGeometry(shirtGeometry);
    }
  }, [nodes]);

  const logoTexture = useTexture(logoDecal);
  const fullTexture = useTexture(fullDecal);

  // Apply clipping to textures
  if (clipMask.enabled) {
    [logoTexture, fullTexture].forEach(texture => {
      if (texture) {
        texture.userData = {
          ...texture.userData,
          clipMask: clipMask.enabled,
          clipIntensity: clipMask.intensity
        };
      }
    });
  }

  useFrame((state, delta) => {
    if (materials?.lambert1) {
      easing.dampC(materials.lambert1.color, color, 0.25, delta);
    }
  });

  if (!meshGeometry) return null;

  return (
    <group>
      <mesh
        castShadow
        geometry={meshGeometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {isFullTexture && fullTexture && (
          <Decal 
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={textureScale.full}
            map={fullTexture}
            mapAnisotropy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}

        {isLogoTexture && logoTexture && (
          <Decal 
            position={[
              texturePosition.logo.x,
              texturePosition.logo.y,
              0.15
            ]}
            rotation={[0, 0, 0]}
            scale={textureScale.logo}
            map={logoTexture}
            mapAnisotropy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
};

// Preload the model
useGLTF.preload('./models/shirt_baked.glb');

export default Shirt;