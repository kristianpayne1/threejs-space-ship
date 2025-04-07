import { Canvas } from "@react-three/fiber";
import { AudioListenerProvider } from "./hooks/useAudioListener.jsx";
import { Loader } from "@react-three/drei";
import { Suspense } from "react";
import Game from "./components/Game.jsx";

function App() {
    return (
        <AudioListenerProvider>
            <Canvas camera={{ position: [0, 0, -40], fov: 40 }} shadows>
                <Suspense fallback={null}>
                    <Game />
                </Suspense>
            </Canvas>
            <Loader />
        </AudioListenerProvider>
    );
}

export default App;
