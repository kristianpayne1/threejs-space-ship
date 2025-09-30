import { useMemo, useRef } from "react";
import { useFlightControlsContext } from "../hooks/useFlightControls.jsx";
import { Instance, Instances, useGLTF } from "@react-three/drei";
import { MeshStandardMaterial, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import useCurrentTexture from "../hooks/useCurrentTexture.jsx";

const fullScale = new Vector3(0.02, 0.02, 0.02);

function getRandomPosition() {
    return [
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 200,
        Math.random() * 600,
    ];
}

function Asteroid({ position, rotation, size }) {
    const ref = useRef(null);
    const { getSpeed } = useFlightControlsContext();

    useFrame((_, deltaTime) => {
        const speed = getSpeed();
        if (!ref.current) return;
        ref.current.scale.lerp(fullScale, deltaTime);
        ref.current.position.z -= deltaTime * speed;
        if (ref.current.position.z < -50) {
            ref.current.scale.set(0, 0, 0);
            const newPosition = getRandomPosition();
            ref.current.position.set(newPosition[0], newPosition[1], 600);
        }
    });

    return (
        <Instance
            ref={ref}
            rotation={rotation}
            position={position}
            scale={fullScale}
        />
    );
}

function Asteroids({ range = 150, limit = 100 }) {
    const ref = useRef();
    const { nodes, materials } = useGLTF("./models/Astroid_01.glb");

    useCurrentTexture(ref);

    // Random positions for asteroids
    const positions = useMemo(
        () => Array.from({ length: limit }, getRandomPosition),
        [],
    );

    return (
        <Instances
            ref={ref}
            range={range}
            limit={limit}
            material={new MeshStandardMaterial({ color: "gray" })}
            geometry={nodes.SM_Env_Astroid_01.geometry}
        >
            {positions.map((position) => (
                <Asteroid position={position} />
            ))}
        </Instances>
    );
}

export default Asteroids;
