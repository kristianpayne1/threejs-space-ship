import { TextureProvider } from "../hooks/useTextures.jsx";
import Ship from "./Ship.jsx";
import { Environment } from "@react-three/drei";
import { CurrentTextureProvider } from "../hooks/useCurrentTexture.jsx";
import SpaceParticles from "./SpaceParticles.jsx";
import { FlightControlsProvider } from "../hooks/useFlightControls.jsx";
import Asteroids from "./Asteroids.jsx";
import { Physics } from "@react-three/rapier";

function Game() {
    return (
        <Physics debug={true}>
            <TextureProvider>
                <FlightControlsProvider>
                    <CurrentTextureProvider>
                        <Ship position={[0, 0, -20]} />
                    </CurrentTextureProvider>
                    <SpaceParticles />
                    <Asteroids />
                    <Asteroids variant={2} minScale={0.005} maxScale={0.025} />
                    <Asteroids variant={3} minScale={0.005} maxScale={0.025} />
                </FlightControlsProvider>
                <ambientLight />
                <directionalLight intensity={3} position={[-10, 10, -10]} />
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
        </Physics>
    );
}

export default Game;
