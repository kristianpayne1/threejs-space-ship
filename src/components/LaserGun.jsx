import { useGLTF } from "@react-three/drei";
import useTextures from "../hooks/useTextures.jsx";

function LaserGun() {
    const { nodes, materials } = useGLTF("./models/Laser_Turret.glb");
    const textures = useTextures();

    return <group></group>;
}

export default LaserGun;
