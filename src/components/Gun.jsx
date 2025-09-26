import LaserGun from "./LaserGun.jsx";

function Gun({ type, ...props }) {
    switch (type) {
        case "laser_gun":
            return <LaserGun {...props} />;
        default:
            return <LaserGun {...props} />;
    }
}

export default Gun;
