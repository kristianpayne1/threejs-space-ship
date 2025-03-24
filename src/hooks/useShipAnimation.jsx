import { Euler, Quaternion, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import { easings, useSpring } from "@react-spring/three";

function getRandomPosition(origin, max = 1) {
    const x = Math.random() * (max + max) - max;
    const y = Math.random() * (max + max) - max;
    const z = Math.random() * (max + max) - max;

    return [origin[0] + x, origin[1] + y, origin[2] + z];
}
function move(ref, { api, origin }) {
    const position = getRandomPosition(origin);
    api.start({
        position,
        config: {
            duration: Math.random() * (10e3 - 5e3) + 5e3,
        },
        onRest: () => move(ref, { api, origin }), // Recursive movement
    });
}
function useShipAnimation(ref, position, rotation) {
    const [springs, api] = useSpring(() => ({
        position,
        config: {
            duration: Math.random() * (10e3 - 5e3) + 5e3,
            tension: 400,
            easing: easings.easeInOutBack,
        },
    }));

    const previousPosition = new Vector3(...position);
    const currentPosition = new Vector3();
    const maxRotation = Math.PI / 6;
    const newRotation = new Euler();
    const targetQuaternion = new Quaternion();

    useFrame((_, deltaTime) => {
        if (!ref.current) return;
        currentPosition.copy(ref.current.position);
        const distance = currentPosition.sub(previousPosition);
        const velocity = distance.divideScalar(deltaTime);
        previousPosition.copy(ref.current.position);
        newRotation.copy(ref.current.rotation);
        newRotation.x = -velocity.y * maxRotation;
        newRotation.z = -velocity.x * maxRotation;
        targetQuaternion.setFromEuler(newRotation);
        console.log(targetQuaternion);
        ref.current.quaternion.slerp(targetQuaternion, 0.001);
    });

    useEffect(() => {
        move(ref, { api, origin: position, rotation });
    }, [ref, api]);

    return [springs, api];
}

export default useShipAnimation;
