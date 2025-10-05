import { useMemo, useRef } from "react";
import { useFlightControlsContext } from "../hooks/useFlightControls.jsx";
import { Instance, Instances, useGLTF } from "@react-three/drei";
import { MeshStandardMaterial, Vector3, MathUtils } from "three";
import { useFrame } from "@react-three/fiber";
import useCurrentTexture from "../hooks/useCurrentTexture.jsx";

function getRandomPosition() {
    return [
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 300,
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

function getRandomScale(min, max) {
    const s = MathUtils.randFloat(min, max);
    return new Vector3(s, s, s);
}

function Asteroid({ position, minScale, maxScale }) {
    const ref = useRef(null);
    const rotationRef = useRef(getRandomRotation());
    const scaleRef = useRef(getRandomScale(minScale, maxScale));

    const { getSpeed } = useFlightControlsContext();

    const { axis, spinSpeed, initialRotation } = rotationRef.current;
    const scale = scaleRef.current;

    useFrame((_, deltaTime) => {
        const speed = getSpeed();
        if (!ref.current) return;

        ref.current.scale.lerp(scale, deltaTime * 2);
        ref.current.position.z -= deltaTime * speed;
        ref.current.rotateOnAxis(axis, spinSpeed * deltaTime);
        if (ref.current.position.z < -50) {
            ref.current.scale.set(0, 0, 0);
            const newPosition = getRandomPosition();
            rotationRef.current = getRandomRotation();
            scaleRef.current = getRandomScale(minScale, maxScale);
            ref.current.position.set(newPosition[0], newPosition[1], 600);
        }
    });

    return (
        <Instance
            ref={ref}
            position={position}
            rotation={initialRotation}
            scale={scale}
        />
    );
}

function Asteroids({
    range = 150,
    limit = 24,
    variant = 1,
    minScale = 0.0075,
    maxScale = 0.06,
}) {
    const ref = useRef();
    const { nodes } = useGLTF(`./models/Astroid_0${variant}.glb`);
    const geometry = nodes[`SM_Env_Astroid_0${variant}`].geometry;

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
            geometry={geometry}
        >
            {positions.map((position, i) => (
                <Asteroid
                    key={i}
                    position={position}
                    maxScale={maxScale}
                    minScale={minScale}
                />
            ))}
        </Instances>
    );
}

export default Asteroids;
