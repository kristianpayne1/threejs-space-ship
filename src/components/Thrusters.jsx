import { Cone } from "@react-three/drei";
import { useRef } from "react";

function Thrusters({ positions = [[0, 0, 0]] }) {
    const ref = useRef(null);
    return (
        <>
            {positions.map((position) => (
                <Cone
                    ref={ref}
                    position={position}
                    args={[0.15, 6, 8, 10, true]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    material-color="skyblue"
                />
            ))}
        </>
    );
}

export default Thrusters;
