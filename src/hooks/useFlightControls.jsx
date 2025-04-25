import { Euler, Plane, Quaternion, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useSpring } from "@react-spring/three";
import { useEffect } from "react";
import useIsOver from "./useIsOver.jsx";
import usePointerPosition from "./usePointerPosition.jsx";

// const distance = new Vector3(0, 0, 0);
const previousPosition = new Vector3(0, 0, 0);
const currentPosition = new Vector3();

const previousRotation = new Quaternion();
const maxRotation = Math.PI / 100;
const newRotation = new Euler();
const currentRotation = new Quaternion();
const targetQuaternion = new Quaternion();

const plane = new Plane(new Vector3(0, 0, Math.PI / 2));
plane.translate(new Vector3(0, 0, 200));

let rotate = 0,
    rotateZ = 0;

function handleWindowPointerOut(api, position) {
    return function () {
        api.start({
            position,
        });
    };
}

function handleKeyDown(enabled) {
    return function (e) {
        if (!enabled) return;
        const key = e.key;
        if (key === "a") rotate = -1;
        if (key === "d") rotate = 1;
    };
}

function handleKeyUp(e) {
    const key = e.key;
    if (key === "a" || key === "d") {
        rotate = 0;
        rotateZ = 0;
    }
}

function useFlightControls(ref, { position = [0, 0, 0], enabled = true }) {
    const result = usePointerPosition();
    const [springs, api] = useSpring(() => ({
        position,
        config: { mass: 200, friction: 600, tension: 800 },
    }));

    useFrame((_, deltaTime) => {
        // position ship
        currentPosition.set(...position);
        currentPosition.lerp(
            new Vector3(result.x, result.y, currentPosition.z),
            0.1,
        );

        api.start({
            position: currentPosition.toArray(),
        });

        // point ship towards cursor
        previousRotation.copy(ref.current.quaternion);
        ref.current.lookAt(result);
        newRotation.copy(ref.current.rotation);
        ref.current.quaternion.copy(previousRotation);

        // calculate velocity
        currentPosition.copy(ref.current.position);
        const distance = currentPosition.sub(previousPosition);
        const velocity = distance.divideScalar(deltaTime);
        previousPosition.copy(ref.current.position);
        if (!velocity.x) velocity.x = 0;

        // rotate ship based on velocity
        if (Math.abs(rotate)) rotateZ += rotate * 6 * deltaTime;
        newRotation.z += -velocity.x * maxRotation + rotateZ;
        targetQuaternion.setFromEuler(newRotation);
        currentRotation.slerp(targetQuaternion, 0.05);
        ref.current.quaternion.copy(currentRotation);
    });

    useEffect(() => {
        window.addEventListener(
            "pointerout",
            handleWindowPointerOut(api, position),
        );
        window.addEventListener("keydown", handleKeyDown(enabled));
        window.addEventListener("keyup", handleKeyUp);

        return () => {
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
