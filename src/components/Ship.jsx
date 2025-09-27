import { useGLTF } from "@react-three/drei";
import { animated } from "@react-spring/three";
import { useRef } from "react";
import useFlightControls from "../hooks/useFlightControls.jsx";
import Thrusters from "./Thrusters.jsx";
import Crosshair from "./Crosshair.jsx";
import Guns from "./Guns.jsx";

function Ship({ position, ...props }) {
    const ref = useRef(null);
    const shipRef = useRef(null);

    const { nodes, materials } = useGLTF("./models/Space_Ship.glb");

    const [springs] = useFlightControls(ref, { position });

    return (
        <animated.group
            ref={ref}
            position={springs.position}
            rotation={springs.rotation}
            {...props}
        >
            <mesh
                ref={shipRef}
                castShadow={true}
                receiveShadow={true}
                geometry={nodes.SM_Ship_Fighter_03.geometry}
                material={materials["Material.001"]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.004}
            />
            <Thrusters
                positions={[
                    [-0.93, 0.4, -2],
                    [0.93, 0.4, -2],
                ]}
            />
            <Guns
                guns={[
                    {
                        type: "laser_gun",
                        position: [-1.5, 0.575, 0],
                        rotation: [0, 0, Math.PI * -0.1],
                    },
                    {
                        type: "laser_gun",
                        position: [1.5, 0.575, 0],
                        rotation: [0, 0, Math.PI * 0.1],
                    },
                ]}
            />
            <Crosshair />
        </animated.group>
    );
}

export default Ship;
