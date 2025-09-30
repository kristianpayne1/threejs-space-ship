import Gun from "./Gun";
import { useLayoutEffect, useState } from "react";

function Guns({ guns = [] }) {
    const [fire, setFire] = useState(false);

    useLayoutEffect(() => {
        function onMouseDown() {
            setFire(true);
        }
        function onMouseUp() {
            setFire(false);
        }

        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    return (
        <group>
            {guns.map(({ type, ...gunProps }, index) => (
                <Gun key={index} fire={fire} type={type} {...gunProps} />
            ))}
        </group>
    );
}

export default Guns;
