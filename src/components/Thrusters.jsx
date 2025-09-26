import { Cone, shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";

import vertexShader from "../shaders/thrusters/vertex.glsl";
import fragmentShader from "../shaders/thrusters/fragment.glsl";
import { Color } from "three";
import { getRandomInt } from "../utils.js";

const ThrusterMaterial = shaderMaterial(
    {
        uColor: new Color("#a4d5fd"),
        uTime: 0.0,
    },
    vertexShader,
    fragmentShader,
);

extend({ ThrusterMaterial });

function Thruster({ position, frequency = 150 }) {
    const matRef = useRef();
    useFrame((_, deltaTime) => {
        if (!matRef.current) return;
        matRef.current.uniforms.uTime.value +=
            getRandomInt(0, 1) + deltaTime * frequency;
    });
    return (
        <Cone
            position={position}
            args={[0.11, 1, 8, 10, true]}
            rotation={[-Math.PI / 2, Math.PI / 7, 0]}
        >
            <thrusterMaterial ref={matRef} transparent />
        </Cone>
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
