import { useEffect, useRef, useState } from "react";
import { Instance, Instances, useGLTF } from "@react-three/drei";
import useCurrentTexture from "../hooks/useCurrentTexture.jsx";
import { CapsuleGeometry, MeshStandardMaterial, Vector3 } from "three";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import usePointerPosition from "../hooks/usePointerPosition.jsx";

const worldPosition = new Vector3();
let shotId = 0;

function Laser({ position, target, range, onDone }) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current.lookAt(target);
        ref.current.rotateX(Math.PI / 2);
    }, []);

    useFrame((_, deltaTime) => {
        if (!ref.current) return;
        ref.current.position.lerp(target, deltaTime);
        if (ref.current.position.distanceTo(position) >= range) onDone();
    });

    return (
        <Instance
            ref={ref}
            rotation={[Math.PI / 2, 0, 0]}
            position={position}
        />
    );
}

function Lasers({ fire, fireRate = 0.2, range = 150, limit = 100, gunRef }) {
    const { scene } = useThree();
    const [shots, setShots] = useState([]);
    const lastFired = useRef(0);

    const result = usePointerPosition();

    function addShot() {
        if (!fire || !gunRef.current) return;
        lastFired.current = 0;
        gunRef.current.getWorldPosition(worldPosition);
        const position = worldPosition.clone();
        const id = shotId++;
        setShots((prev) => [
            ...prev,
            {
                id,
                position,
                target: result.clone(),
                range,
                onDone: () =>
                    setShots((prev) => prev.filter((shot) => shot.id !== id)),
            },
        ]);
    }

    useEffect(() => {
        if (fire && lastFired >= fireRate) addShot();
    }, [fire]);

    useFrame((_, deltaTime) => {
        lastFired.current += deltaTime;
        if (lastFired.current >= fireRate) addShot();
    });

    return createPortal(
        <Instances
            range={range}
            limit={limit}
            material={
                new MeshStandardMaterial({
                    color: "red",
                    emissive: "red",
                    emissiveIntensity: 1.5,
                })
            }
            geometry={new CapsuleGeometry(0.05, 3, 1, 7, 1)}
        >
            {shots.map(({ id, ...laserProps }) => (
                <Laser key={id} {...laserProps} />
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
