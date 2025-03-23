import { Canvas } from "@react-three/fiber";
import { AudioListenerProvider } from "./hooks/useAudioListener.jsx";
import Duck from "./components/Duck.jsx";
import { ContactShadows, OrbitControls } from "@react-three/drei";

function App() {
    return (
        <AudioListenerProvider>
            <Canvas camera={{ position: [3, 3, -3] }}>
                <ambientLight intensity={3} />
                <OrbitControls />
                <Duck />
                <ContactShadows
                    position={[0, -0.25, 0]}
                    opacity={0.5}
                    scale={10}
                    blur={1.5}
                    far={0.8}
                />
            </Canvas>
        </AudioListenerProvider>
    );
}

export default App;
