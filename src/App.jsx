import { Canvas } from "@react-three/fiber";
import { AudioListenerProvider } from "./hooks/useAudioListener.jsx";
import { Loader, Stars } from "@react-three/drei";
import Ship from "./components/Ship.jsx";
import { TextureProvider } from "./hooks/useTextures.jsx";
import { Suspense } from "react";

function App() {
    return (
        <AudioListenerProvider>
            <Canvas camera={{ position: [10, 8, 10] }} shadows>
                <Suspense fallback={null}>
                    <TextureProvider>
                        <ambientLight />
                        <directionalLight />
                        <Ship />
                        <Stars radius={300} count={2000} saturation={0} />
                    </TextureProvider>
                </Suspense>
            </Canvas>
            <Loader />
        </AudioListenerProvider>
    );
}

export default App;
