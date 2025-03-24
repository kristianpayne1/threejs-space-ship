import { useGLTF } from "@react-three/drei";
import { animated } from "@react-spring/three";
import { useEffect, useRef, useState } from "react";
import useTextures from "../hooks/useTextures.jsx";
import useShipAnimation from "../hooks/useShipAnimation.jsx";
import { SRGBColorSpace } from "three";

function Ship({ position = [0, 0, 0], rotation, ...props }) {
    const ref = useRef(null);
    const shipRef = useRef(null);
    const [textureIndex, setTextureIndex] = useState(1);

    const { nodes, materials } = useGLTF("./models/Space_Ship.glb");
    const textures = useTextures();

    const [springs] = useShipAnimation(ref, position, rotation);

    useEffect(() => {
        if (!textures.length || !shipRef.current) return;
        const texture = textures[textureIndex % textures.length];
        texture.colorSpace = SRGBColorSpace;
        texture.flipY = false;
        texture.needsUpdate = true;
        shipRef.current.material.map = texture;
    }, [textureIndex, shipRef, textures]);

    return (
        <animated.group
            ref={ref}
            position={springs.position}
            rotation={rotation}
            onClick={() => setTextureIndex((state) => state + 1)}
            {...props}
        >
            <mesh
                ref={shipRef}
                castShadow={true}
                receiveShadow={true}
                geometry={nodes.SM_Ship_Fighter_03.geometry}
                material={materials["Material.001"]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.01}
            />
        </animated.group>
    );
}

export default Ship;
