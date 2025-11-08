import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { animated } from "@react-spring/three";
import { useRef } from "react";
import useFlightControls from "../hooks/useFlightControls.jsx";
import Thrusters from "./Thrusters.jsx";
import Crosshair from "./Crosshair.jsx";
import Guns from "./Guns.jsx";
import { Quaternion, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

function Ship({ position, ...props }) {
    const bodyRef = useRef(null);
    const visualRef = useRef(null);

    const { nodes, materials } = useGLTF("./models/Space_Ship.glb");

    const [springs] = useFlightControls(visualRef, { position });

    useFrame(() => {
        if (!bodyRef.current || !visualRef.current) return;

        const body = bodyRef.current;
        const ship = visualRef.current;

        const pos = new Vector3();
        const quat = new Quaternion();
        ship.getWorldPosition(pos);
        ship.getWorldQuaternion(quat);

        body.setNextKinematicTranslation(pos);
        body.setNextKinematicRotation(quat);
    });

    return (
        <>
            <RigidBody ref={bodyRef} type="kinematicPosition" colliders={false}>
                <CuboidCollider args={[1.5, 0.5, 2]} position={[0, 0.2, 0]} />
            </RigidBody>

            <animated.group
                ref={visualRef}
                position={springs.position}
                rotation={springs.rotation}
                {...props}
            >
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.SM_Ship_Fighter_03.geometry}
                    material={materials["Material.001"]}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.004}
                />
                <Thrusters
                    positions={[
                        [-0.93, 0.4, -1.15],
                        [0.93, 0.4, -1.15],
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
        </>
    );
}

export default Ship;
