import { PositionalAudio, useCursor, useGLTF } from "@react-three/drei";
import { useRef, useState } from "react";
import useAudioListener from "../hooks/useAudioListener.jsx";
import { animated, useSpring } from "@react-spring/three";

function Duck(props) {
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    const soundRef = useRef();

    const duck = useGLTF("./models/duck.glb");

    const audioListener = useAudioListener();

    useCursor(hovered);

    const { scale } = useSpring({
        scale: clicked ? [0.8, 1.2, 0.8] : [1, 1, 1],
        config: { mass: 1, tension: 1000, friction: 50 },
        onRest: () => setClicked(false)
    });

    const handleClick = () => {
        soundRef.current.play();
        setClicked(true);
    };

    return (
        <group>
            <PositionalAudio
                ref={soundRef}
                url={"./sounds/quack.mp3"}
                audioListener={audioListener}
                loop={false}
            />
            <animated.primitive
                object={duck.scene}
                scale={scale}
                onPointerOver={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                onClick={handleClick}
                {...props} />
        </group>
    );
}

export default Duck;
