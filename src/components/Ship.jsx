import { useGLTF } from "@react-three/drei";

function Ship(props) {
    const { nodes, materials } = useGLTF("./models/space-ship.glb");
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow={true}
                receiveShadow={true}
                geometry={nodes.SM_Ship_Fighter_03.geometry}
                material={materials["Material.001"]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.01}
            />
        </group>
    );
}

export default Ship;
