import { useMemo, useRef } from "react";
import { useFlightControlsContext } from "../hooks/useFlightControls.jsx";
import { Instance, Instances, useGLTF } from "@react-three/drei";
import { MeshStandardMaterial, Vector3, MathUtils } from "three";
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

function getRandomAxis() {
    const axis = new Vector3(Math.random(), Math.random(), Math.random());
    axis.normalize();
    return axis;
}

function getRandomRotation() {
    return {
        axis: getRandomAxis(),
        spinSpeed: MathUtils.randFloat(0.2, 2.0),
        initialRotation: [
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
        ],
    };
}

function Asteroid({ position }) {
    const ref = useRef(null);
    const rotationRef = useRef(getRandomRotation());

    const { getSpeed } = useFlightControlsContext();

    const { axis, spinSpeed, initialRotation } = rotationRef.current;

    useFrame((_, deltaTime) => {
        const speed = getSpeed();
        if (!ref.current) return;

        ref.current.scale.lerp(fullScale, deltaTime * 2);
        ref.current.position.z -= deltaTime * speed;
        ref.current.rotateOnAxis(axis, spinSpeed * deltaTime);
        if (ref.current.position.z < -50) {
            ref.current.scale.set(0, 0, 0);
            const newPosition = getRandomPosition();
            rotationRef.current = getRandomRotation();
            ref.current.position.set(newPosition[0], newPosition[1], 600);
        }
    });

    return (
        <Instance
            ref={ref}
            position={position}
            rotation={initialRotation}
            scale={fullScale}
        />
    );
}

function Asteroids({ range = 150, limit = 100 }) {
    const ref = useRef();
    const { nodes } = useGLTF("./models/Astroid_01.glb");

    useCurrentTexture(ref);

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
            {positions.map((position, i) => (
                <Asteroid key={i} position={position} />
            ))}
        </Instances>
    );
}

export default Asteroids;
