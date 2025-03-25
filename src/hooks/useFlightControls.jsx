import { Euler, Plane, Quaternion, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useSpring } from "@react-spring/three";
import { useEffect } from "react";

const previousPosition = new Vector3(0, 0, 0);
const currentPosition = new Vector3();
const maxRotation = Math.PI / 150;
const newRotation = new Euler();
const targetQuaternion = new Quaternion();
const plane = new Plane(new Vector3(1, 0, 1));
const result = new Vector3(0, 0, 0);

let isOver = false;
function handleWindowPointerOver() {
    isOver = true;
}

function handleWindowPointerOut(api) {
    return function () {
        isOver = false;
        api.start({
            position: [0, 0, 0],
        });
    };
}

function handleWindowPointerMove(api) {
    return function () {
        if (!isOver || !result) return;
        api.start({
            position: [result.x, result.y, result.z - 8],
            config: { mass: 200, friction: 350, tension: 800 },
        });
    };
}

function useFlightControls(ref) {
    const [springs, api] = useSpring(() => ({
        config: { mass: 200, friction: 350, tension: 800 },
    }));

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
        ref.current.quaternion.slerp(targetQuaternion, 0.1);
    });

    useFrame(({ raycaster }) => {
        if (!isOver) return;
        raycaster.ray.intersectPlane(plane, result);
    });

    useEffect(() => {
        window.addEventListener("pointerover", handleWindowPointerOver);
        window.addEventListener("pointerout", handleWindowPointerOut(api));
        window.addEventListener("pointermove", handleWindowPointerMove(api));

        return () => {
            window.removeEventListener("pointerover", handleWindowPointerOver);
            window.removeEventListener(
                "pointerout",
                handleWindowPointerOut(api),
            );
            window.removeEventListener(
                "pointermove",
                handleWindowPointerMove(api),
            );
        };
    }, [api]);

    return [springs, api];
}

export default useFlightControls;
