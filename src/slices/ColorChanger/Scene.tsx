import { useMemo } from "react";
import * as THREE from "three";
import { Stage, useTexture } from "@react-three/drei";

import { Keyboard } from "@/components/Keyboard";
import { KEYCAP_TEXTURES } from ".";

type SceneProps = {
  selectedTextureId: string;
  onAnimationComplete: () => void;
};

export default function Scene({
  selectedTextureId,
  onAnimationComplete,
}: SceneProps) {
  const texturePaths = KEYCAP_TEXTURES.map((t) => t.path);
  const textures = useTexture(texturePaths);

  const materials = useMemo(() => {
    const materialMap: { [key: string]: THREE.MeshStandardMaterial } = {};

    KEYCAP_TEXTURES.forEach((textureConfig, idx) => {
      const texture = Array.isArray(textures) ? textures[idx] : textures;

      if (texture) {
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;

        materialMap[textureConfig.id] = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.7,
        });
      }
    });

    return materialMap;
  }, [textures]);

  const currentKnobColor = KEYCAP_TEXTURES.find(
    (t) => t.id === selectedTextureId,
  )?.knobColor;

  return (
    <Stage environment={"city"} intensity={0.05} shadows="contact">
      <group>
        <Keyboard
          keycapMaterial={materials[selectedTextureId]}
          knobColor={currentKnobColor}
        />
      </group>
    </Stage>
  );
}
