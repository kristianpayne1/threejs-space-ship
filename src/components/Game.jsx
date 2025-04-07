import { TextureProvider } from "../hooks/useTextures.jsx";
import Ship from "./Ship.jsx";

function Game() {
    return (
        <TextureProvider>
            <ambientLight />
            <directionalLight />
            <Ship position={[0, 0, -20]} />
        </TextureProvider>
    );
}

export default Game;
