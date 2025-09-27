import LaserGun from "./LaserGun.jsx";
import { useLayoutEffect, useMemo, useState } from "react";

function Gun({ type, ...props }) {
    const [fire, setFire] = useState(false);

    useLayoutEffect(() => {
        function onMouseDown() {
            setFire(true);
        }
        function onMouseUp() {
            setFire(false);
        }

        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    const GunType = useMemo(() => {
        return (gunProps) => {
            switch (type) {
                case "laser_gun":
                    return <LaserGun {...{ ...gunProps, ...props }} />;
                default:
                    return <LaserGun {...{ ...gunProps, ...props }} />;
            }
        };
    }, [type]);

    return (
        <group>
            <GunType fire={fire} />
        </group>
    );
}

export default Gun;
