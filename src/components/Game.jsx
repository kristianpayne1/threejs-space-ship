import { TextureProvider } from "../hooks/useTextures.jsx";
import Ship from "./Ship.jsx";
import { Environment, OrbitControls } from "@react-three/drei";

function Game() {
    return (
        <TextureProvider>
            <ambientLight />
            <directionalLight />
            <Ship position={[0, 0, -20]} />
            <Environment
                background={true}
                path={"./textures/environment/"}
                backgroundIntensity={0.3}
                backgroundRotation={[0, Math.PI / 4, 0]}
                files={[
                    "px.png",
                    "nx.png",
                    "py.png",
                    "ny.png",
                    "pz.png",
                    "nz.png",
                ]}
            />
        </TextureProvider>
    );
}

export default Game;
