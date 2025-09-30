import LaserGun from "./LaserGun.jsx";
import { useMemo } from "react";

function Gun({ type, fire, ...props }) {
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
