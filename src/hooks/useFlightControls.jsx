import { Euler, Plane, Quaternion, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useSpring } from "@react-spring/three";
import { useEffect } from "react";

const previousPosition = new Vector3(0, 0, 0);
const currentPosition = new Vector3();

const previousRotation = new Quaternion();
const maxRotation = Math.PI / 100;
const newRotation = new Euler();
const currentRotation = new Quaternion();
const targetQuaternion = new Quaternion();

const plane = new Plane(new Vector3(0, 0, Math.PI / 2));
const result = new Vector3(0, 0, 0);

let isOver = false;
let offsetY = 0,
    offsetX = 0;
function handleWindowPointerOver() {
    isOver = true;
}

function handleWindowPointerOut(api, position) {
    return function () {
        isOver = false;
        api.start({
            position,
        });
    };
}

function handleKeyDown(enabled) {
    return function (e) {
        if (!enabled) return;
        const key = e.key;
        if (key === "a") offsetX = 15;
        if (key === "d") offsetX = -15;
        if (key === "w") offsetY = 10;
        if (key === "s") offsetY = -10;
    };
}

function handleKeyUp(e) {
    const key = e.key;
    if (key === "a" || key === "d") offsetX = 0;
    if (key === "w" || key === "s") offsetY = 0;
}

function useFlightControls(ref, { position = [0, 0, 0], enabled = true }) {
    const [springs, api] = useSpring(() => ({
        position,
        config: { mass: 200, friction: 350, tension: 800 },
    }));

    useFrame(({ raycaster }, deltaTime) => {
        if (!isOver || !enabled) return;
        raycaster.ray.intersectPlane(plane, result);
        currentPosition.set(...position);
        currentPosition.x = offsetX;
        currentPosition.y = offsetY;

        api.start({
            position: currentPosition.toArray(),
        });

        previousRotation.copy(ref.current.quaternion);
        ref.current.lookAt(result);
        newRotation.copy(ref.current.rotation);
        ref.current.quaternion.copy(previousRotation);

        // calculate velocity
        currentPosition.copy(ref.current.position);
        const distance = currentPosition.sub(previousPosition);
        const velocity = distance.divideScalar(deltaTime);
        previousPosition.copy(ref.current.position);

        // rotate ship based on velocity
        newRotation.z = -velocity.x * maxRotation;
        targetQuaternion.setFromEuler(newRotation);
        currentRotation.slerp(targetQuaternion, 0.05);
        ref.current.rotation.x = currentRotation.x;
        ref.current.rotation.y = currentRotation.y;
        ref.current.rotation.z = currentRotation.z;
    });

    useEffect(() => {
        window.addEventListener("pointerover", handleWindowPointerOver);
        window.addEventListener(
            "pointerout",
            handleWindowPointerOut(api, position),
        );
        window.addEventListener("keydown", handleKeyDown(enabled));
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("pointerover", handleWindowPointerOver);
            window.removeEventListener(
                "pointerout",
                handleWindowPointerOut(api, position),
            );
            window.removeEventListener("keydown", handleKeyDown(enabled));
            window.addEventListener("keyup", handleKeyUp);
        };
    }, [api, enabled]);

    return [springs, api];
}

export default useFlightControls;
