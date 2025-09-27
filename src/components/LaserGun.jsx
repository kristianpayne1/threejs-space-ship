import { useEffect, useRef } from "react";
import { Instance, Instances, useGLTF } from "@react-three/drei";
import useCurrentTexture from "../hooks/useCurrentTexture.jsx";
import { CapsuleGeometry, MeshStandardMaterial, Vector3 } from "three";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import usePointerPosition from "../hooks/usePointerPosition.jsx";

const worldPosition = new Vector3();

function Laser({ position, target, range }) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current.lookAt(target);
        ref.current.rotateX(Math.PI / 2);
    }, []);

    useFrame((_, deltaTime) => {
        if (!ref.current) return;
        ref.current.position.lerp(target, deltaTime);
        if (ref.current.position.z >= range) {
            console.log("remove laser");
        }
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
    const lasers = useRef([]);

    const result = usePointerPosition();

    useEffect(() => {
        if (!fire || !gunRef.current) return;
        gunRef.current.getWorldPosition(worldPosition);
        const position = worldPosition.clone();
        lasers.current.push({
            position,
            target: result.clone(),
            range,
        });
    }, [fire]);

    return createPortal(
        <Instances
            range={range}
            limit={limit}
            material={new MeshStandardMaterial({ color: "red" })}
            geometry={new CapsuleGeometry(0.05, 3, 1, 7, 1)}
        >
            {lasers.current.map((laserProps, index) => (
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
