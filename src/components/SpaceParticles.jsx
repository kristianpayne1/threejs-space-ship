import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useFlightControlsContext } from "../hooks/useFlightControls.jsx";

function SpaceParticles({ count = 500, ...props }) {
    const points = useRef();
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

    useFrame((state, delta) => {
        const speed = getSpeed();
        const pos = points.current.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
            pos[i * 3 + 2] -= speed * delta;
            if (pos[i * 3 + 2] < -50) pos[i * 3 + 2] = 300;
        }
        points.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={points} {...props}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial color="white" size={0.2} sizeAttenuation />
        </points>
    );
}

export default SpaceParticles;
