import { useGLTF } from "@react-three/drei";
import { animated } from "@react-spring/three";
import { useEffect, useRef, useState } from "react";
import useTextures from "../hooks/useTextures.jsx";
import { SRGBColorSpace } from "three";
import useFlightControls from "../hooks/useFlightControls.jsx";
import LaserGun from "./LaserGun.jsx";

function Ship({ position, ...props }) {
    const ref = useRef(null);
    const shipRef = useRef(null);
    const [textureIndex, setTextureIndex] = useState(1);

    const { nodes, materials } = useGLTF("./models/Space_Ship.glb");
    const textures = useTextures();

    const [springs] = useFlightControls(ref, { position });

    // swap texture
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
            rotation={springs.rotation}
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
                scale={0.004}
            />
            <LaserGun />
        </animated.group>
    );
}

export default Ship;
