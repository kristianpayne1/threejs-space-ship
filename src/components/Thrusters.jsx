import { Cone, shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";

import vertexShader from "../shaders/thrusters/vertex.glsl";
import fragmentShader from "../shaders/thrusters/fragment.glsl";
import { Color } from "three";

const ThrusterMaterial = shaderMaterial(
    {
        uColor: new Color("#a4d5fd"),
        uTime: 0.0,
    },
    vertexShader,
    fragmentShader,
);

extend({ ThrusterMaterial });

function Thrusters({ positions = [[0, 0, 0]] }) {
    const ref = useRef(null);
    const materialRef = useRef(null);

    useFrame((_, deltaTime) => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uTime += deltaTime;
    });

    return (
        <>
            {positions.map((position) => (
                <Cone
                    ref={ref}
                    position={position}
                    args={[0.11, 1, 8, 10, true]}
                    rotation={[-Math.PI / 2, Math.PI / 7, 0]}
                >
                    <thrusterMaterial ref={materialRef} transparent={true} />
                    {/*<meshBasicMaterial*/}
                    {/*    transparent={true}*/}
                    {/*    opacity={0.75}*/}
                    {/*    color={"#20bdff"}*/}
                    {/*/>*/}
                </Cone>
            ))}
        </>
    );
}

export default Thrusters;
