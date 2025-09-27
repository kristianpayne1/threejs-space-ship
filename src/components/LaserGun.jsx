import { useEffect, useRef, useState } from "react";
import { Instance, Instances, useGLTF } from "@react-three/drei";
import useCurrentTexture from "../hooks/useCurrentTexture.jsx";
import { CapsuleGeometry, MeshStandardMaterial, Vector3 } from "three";
import { createPortal, useFrame, useThree } from "@react-three/fiber";

const worldPosition = new Vector3();
const worldRotation = new Vector3();

function Laser({ position }) {
    const ref = useRef(null);

    useFrame((_, deltaTime) => {
        if (!ref.current) return;
        ref.current.position.z += deltaTime * 100;
    });

    return (
        <Instance
            ref={ref}
            rotation={[Math.PI / 2, 0, 0]}
            position={position}
        />
    );
}

function Lasers({ fire, range = 100, limit = 100, gunRef }) {
    const { scene } = useThree();
    const [lasers, setLasers] = useState([]);

    useEffect(() => {
        if (!fire || !gunRef.current) return;
        gunRef.current.getWorldPosition(worldPosition);
        gunRef.current.getWorldDirection(worldRotation);
        const position = worldPosition.clone();
        const direction = worldRotation.clone();
        setLasers((prev) => [...prev, { position, direction }]);
    }, [fire]);

    return createPortal(
        <Instances
            range={range}
            limit={limit}
            material={new MeshStandardMaterial({ color: "red" })}
            geometry={new CapsuleGeometry(0.05, 3, 1, 7, 1)}
        >
            {lasers.map((laserProps, index) => (
                <Laser key={index} {...laserProps} />
            ))}
        </Instances>,
        scene,
    );
}

function LaserGun({ fire, ...props }) {
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
                scale={0.004}
            />
            <Lasers fire={fire} gunRef={ref} />
        </group>
    );
}

export default LaserGun;
