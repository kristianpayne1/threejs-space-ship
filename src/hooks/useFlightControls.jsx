import { Euler, Plane, Quaternion, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useSpring } from "@react-spring/three";
import { useEffect, createContext, useContext, useRef } from "react";
import usePointerPosition from "./usePointerPosition.jsx";
import { getRandomInt } from "../utils.js";
import { lerp } from "three/src/math/MathUtils.js";

// const distance = new Vector3(0, 0, 0);
const previousPosition = new Vector3(0, 0, 0);
const currentPosition = new Vector3();
const newShipPosition = new Vector3();
const turbulencePosition = new Vector3();

const previousRotation = new Quaternion();
const maxRotation = Math.PI / 100;
const newRotation = new Euler();
const currentRotation = new Quaternion();
const targetQuaternion = new Quaternion();

const plane = new Plane(new Vector3(0, 0, Math.PI / 2));
plane.translate(new Vector3(0, 0, 200));

let rotate = 0,
    rotateZ = 0,
    throttle = 0;

const flightControlsContext = createContext({
    enabled: true,
    speedStep: 20,
    minSpeed: 10,
    maxSpeed: 100,
    turbulenceFactor: 0.75,
    getSpeed: () => {},
    setSpeed: () => {},
});

export function FlightControlsProvider({
    enabled = true,
    initialSpeed = 150,
    maxSpeed = 300,
    minSpeed = 50,
    speedFactor = 50,
    turbulenceFactor = 0.3,
    children,
}) {
    let speedRef = useRef(initialSpeed);

    function setSpeed(newSpeed) {
        speedRef.current = newSpeed;
    }

    function getSpeed() {
        return speedRef.current;
    }

    return (
        <flightControlsContext.Provider
            value={{
                enabled,
                getSpeed,
                setSpeed,
                speedFactor,
                minSpeed,
                maxSpeed,
                initialSpeed,
                turbulenceFactor,
            }}
        >
            {children}
        </flightControlsContext.Provider>
    );
}

export function useFlightControlsContext() {
    if (!flightControlsContext)
        throw new Error("Must be used within FlightControlsProvider");
    return useContext(flightControlsContext);
}

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
        if (key === "w") throttle = 1;
        if (key === "s") throttle = -1;
    };
}

function handleKeyUp(e) {
    const key = e.key;
    if (key === "a" || key === "d") {
        rotate = 0;
        rotateZ = 0;
    } else if (key === "s" || key === "w") {
        throttle = 0;
    }
}

function useFlightControls(ref, { position = [0, 0, 0] }) {
    const result = usePointerPosition();
    const {
        getSpeed,
        setSpeed,
        initialSpeed,
        speedFactor,
        minSpeed,
        maxSpeed,
        turbulenceFactor,
        enabled,
    } = useFlightControlsContext();
    const [springs, api] = useSpring(() => ({
        position,
        config: { mass: 200, friction: 600, tension: 800 },
    }));

    useFrame((_, deltaTime) => {
        const speed = getSpeed();
        const turbulence = speed * turbulenceFactor;
        const getRandomTurbulence = () => getRandomInt(-turbulence, turbulence);
        const turbulancePosition = turbulencePosition.set(
            getRandomTurbulence(),
            getRandomTurbulence(),
            getRandomTurbulence(),
        );
        // position ship
        currentPosition.set(...position);
        currentPosition.lerp(
            newShipPosition
                .set(result.x, result.y, currentPosition.z)
                .add(turbulancePosition),
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

        if (throttle)
            setSpeed(
                Math.max(
                    Math.min(
                        speed + throttle * deltaTime * speedFactor,
                        maxSpeed,
                    ),
                    minSpeed,
                ),
            );
        else {
            setSpeed(lerp(speed, initialSpeed, deltaTime));
        }
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
