import { useMemo, useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useFlightControlsContext } from "../hooks/useFlightControls.jsx";
import { AdditiveBlending } from "three";

import vertexShader from "../shaders/space_particles/vertex.glsl?raw";
import fragmentShader from "../shaders/space_particles/fragment.glsl?raw";

const SpaceParticlesMaterial = shaderMaterial(
    {
        uTime: 0,
        uLifetime: 5.0,
        uFade: 1.0,
    },
    vertexShader,
    fragmentShader,
);

extend({ SpaceParticlesMaterial });

export default function SpaceParticles({ count = 500 }) {
    const points = useRef();
    const materialRef = useRef();
    const { getSpeed } = useFlightControlsContext();

    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3 + 0] = (Math.random() - 0.5) * 200;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 100;
            arr[i * 3 + 2] = Math.random() * 600;
        }
        return arr;
    }, [count]);

    const birthTimes = useMemo(() => {
        const arr = new Float32Array(count);
        for (let i = 0; i < count; i++) arr[i] = Math.random() * 5.0;
        return arr;
    }, [count]);

    useFrame((state, delta) => {
        const speed = getSpeed();
        const geom = points.current.geometry;
        const pos = geom.attributes.position.array;
        const births = geom.attributes.aBirth.array;

        const time = (materialRef.current.uTime = state.clock.elapsedTime);

        for (let i = 0; i < count; i++) {
            pos[i * 3 + 2] -= speed * delta;
            if (pos[i * 3 + 2] < -50) {
                pos[i * 3 + 2] = 300;
                births[i] = time;
            }
        }

        geom.attributes.position.needsUpdate = true;
        geom.attributes.aBirth.needsUpdate = true;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-aBirth"
                    count={birthTimes.length}
                    array={birthTimes}
                    itemSize={1}
                />
            </bufferGeometry>
            <spaceParticlesMaterial
                ref={materialRef}
                transparent
                depthWrite={false}
                blending={AdditiveBlending}
            />
        </points>
    );
}
