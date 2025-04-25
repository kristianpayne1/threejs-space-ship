import "../styles/crosshair.css";

import { Plane, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import usePointerPosition from "../hooks/usePointerPosition.jsx";

function Crosshair() {
    const farRef = useRef(null);
    const nearRef = useRef(null);

    const texture = useTexture("./textures/hud/crosshair/crosshair.png");
    const result = usePointerPosition();

    // rotate crosshairs to look at camera
    useFrame(({ camera }) => {
        if (!farRef.current || !nearRef.current) return;
        farRef.current.lookAt(camera.position);
        nearRef.current.lookAt(camera.position);
    });

    useFrame(() => {
        if (!farRef.current) return;
        if (result.z === 0) result.z = 200;
        const localPos = farRef.current.parent.worldToLocal(result.clone());
        farRef.current.position.copy(localPos);
    });

    return (
        <group>
            <Plane
                ref={nearRef}
                args={[5, 5]}
                position={[0, 0, 100]}
                rotation={[0, Math.PI, 0]}
            >
                <meshBasicMaterial map={texture} transparent={true} />
            </Plane>
            <Plane
                ref={farRef}
                args={[5, 5]}
                position={[0, 0, 200]}
                rotation={[0, Math.PI, 0]}
            >
                <meshBasicMaterial map={texture} transparent={true} />
            </Plane>
        </group>
    );
}

export default Crosshair;
