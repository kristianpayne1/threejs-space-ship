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
let rotate = 0;
let offsetY = 0;
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

function handleKeyDown(enabled) {
    return function (e) {
        if (!enabled) return;
        const key = e.key;
        if (key === "a") rotate = -0.5;
        if (key === "d") rotate = 0.5;
        if (key === "w") offsetY = 4;
        if (key === "s") offsetY = -4;
    };
}

function handleKeyUp() {
    if (rotate) rotate = 0;
    if (offsetY) offsetY = 0;
}

function useFlightControls(ref, enabled = true) {
    const [springs, api] = useSpring(() => ({
        config: { mass: 200, friction: 350, tension: 800 },
    }));

    useFrame((_, deltaTime) => {
        if (!ref.current || !enabled) return;

        currentPosition.copy(ref.current.position);
        const distance = currentPosition.sub(previousPosition);
        const velocity = distance.divideScalar(deltaTime);
        previousPosition.copy(ref.current.position);
        newRotation.copy(ref.current.rotation);
        newRotation.x = -velocity.y * maxRotation;

        if (rotate) {
            newRotation.z += rotate;
            targetQuaternion.setFromEuler(newRotation);
            ref.current.quaternion.slerp(targetQuaternion, 0.05);
        } else {
            newRotation.z = -velocity.x * maxRotation;
            targetQuaternion.setFromEuler(newRotation);
            ref.current.quaternion.slerp(targetQuaternion, 0.01);
        }
    });

    useFrame(({ raycaster }) => {
        if (!isOver || !enabled) return;
        raycaster.ray.intersectPlane(plane, result);
        api.start({
            position: [result.x, result.y + offsetY, result.z - 8],
            config: { mass: 20, friction: 60, tension: 100 },
        });
    });

    useEffect(() => {
        window.addEventListener("pointerover", handleWindowPointerOver);
        window.addEventListener("pointerout", handleWindowPointerOut(api));
        window.addEventListener("keydown", handleKeyDown(enabled));
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("pointerover", handleWindowPointerOver);
            window.removeEventListener(
                "pointerout",
                handleWindowPointerOut(api, enabled),
            );
            window.removeEventListener("keydown", handleKeyDown(enabled));
            window.addEventListener("keyup", handleKeyUp);
        };
    }, [api, enabled]);

    return [springs, api];
}

export default useFlightControls;
