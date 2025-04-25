import { Plane as threePlane } from "three/src/math/Plane.js";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import useIsOver from "./useIsOver.jsx";
import { useMemo } from "react";

const plane = new threePlane(new Vector3(0, 0, Math.PI / 2));
plane.translate(new Vector3(0, 0, 200));

function usePointerPosition() {
    const isOver = useIsOver();
    const result = useMemo(() => new Vector3(), []);

    useFrame(({ raycaster }) => {
        if (isOver) raycaster.ray.intersectPlane(plane, result);
        else result.set(0, 0, 0);
    });

    return result;
}

export default usePointerPosition;
