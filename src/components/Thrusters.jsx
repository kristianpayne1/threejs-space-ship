import { Cone, shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

import vertexShader from "../shaders/thrusters/vertex.glsl?raw";
import fragmentShader from "../shaders/thrusters/fragment.glsl?raw";
import { Color } from "three";
import { getRandomInt, normalise } from "../utils.js";
import { useFlightControlsContext } from "../hooks/useFlightControls.jsx";

const ThrusterMaterial = shaderMaterial(
    {
        uColor: new Color("#a4d5fd"),
        uTime: 0.0,
    },
    vertexShader,
    fragmentShader,
);

extend({ ThrusterMaterial });

function Thruster({ position, frequency = 200 }) {
    const ref = useRef();
    const matRef = useRef();
    const { getSpeed, initialSpeed } = useFlightControlsContext();

    useEffect(() => {
        if (!ref.current) return;
        ref.current.geometry.translate(0, 1, 0);
    }, []);

    useFrame((_, deltaTime) => {
        const speed = getSpeed();
        if (!matRef.current || !ref.current) return;
        const scaleY = normalise(speed, 0, initialSpeed);
        ref.current.scale.set(1, scaleY, 1);
        matRef.current.uniforms.uTime.value +=
            getRandomInt(0, 1) + deltaTime * frequency;
    });

    return (
        <group position={position}>
            <pointLight
                color={"#30b9ff"}
                position={[0, 0, -0.5]}
                intensity={3}
                castShadow={true}
            />
            <Cone
                ref={ref}
                args={[0.11, 5, 8, 20, true]}
                rotation={[-Math.PI / 2, Math.PI / 7, 0]}
            >
                <thrusterMaterial ref={matRef} transparent />
            </Cone>
        </group>
    );
}

function Thrusters({ positions = [[0, 0, 0]] }) {
    const materialRef = useRef(null);

    useFrame((_, deltaTime) => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uTime += deltaTime;
    });

    return (
        <>
            {positions.map((position, index) => (
                <Thruster key={index} position={position} />
            ))}
        </>
    );
}

export default Thrusters;
