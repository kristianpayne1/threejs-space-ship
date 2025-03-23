import { Canvas } from "@react-three/fiber";
import { AudioListenerProvider } from "./hooks/useAudioListener.jsx";
import { OrbitControls, Stars } from "@react-three/drei";
import Ship from "./components/Ship.jsx";

function App() {
    return (
        <AudioListenerProvider>
            <Canvas camera={{ position: [10, 8, 10] }} shadows>
                <ambientLight />
                <directionalLight />
                <OrbitControls />
                <Ship />
                <Stars radius={300} count={2000} saturation={0} />
            </Canvas>
        </AudioListenerProvider>
    );
}

export default App;
