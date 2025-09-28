import { TextureProvider } from "../hooks/useTextures.jsx";
import Ship from "./Ship.jsx";
import { Environment } from "@react-three/drei";
import { CurrentTextureProvider } from "../hooks/useCurrentTexture.jsx";
import SpaceParticles from "./SpaceParticles.jsx";
import { FlightControlsProvider } from "../hooks/useFlightControls.jsx";

function Game() {
    return (
        <TextureProvider>
            <FlightControlsProvider>
                <CurrentTextureProvider>
                    <Ship position={[0, 0, -20]} />
                </CurrentTextureProvider>
                <SpaceParticles />
            </FlightControlsProvider>
            <ambientLight />
            <directionalLight />
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
