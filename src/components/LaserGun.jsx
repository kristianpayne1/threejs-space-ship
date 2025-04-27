import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import useCurrentTexture from "../hooks/useCurrentTexture.jsx";

function LaserGun(props) {
    const ref = useRef();

    const { nodes, materials } = useGLTF("./models/Laser_Turret.glb");

    useCurrentTexture(ref);

    return (
        <group {...props}>
            <mesh
                ref={ref}
                receiveShadow
                geometry={nodes.SM_Veh_Part_Misc_06.geometry}
                material={materials["Material.001"]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.005}
            />
        </group>
    );
}

export default LaserGun;
