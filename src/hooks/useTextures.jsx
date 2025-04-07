import { useTexture } from "@react-three/drei";
import { createContext, useContext } from "react";

const TextureContext = createContext([]);

function useTextures() {
    return useContext(TextureContext);
}

export function TextureProvider({
    children,
    urls = [
        "./textures/material/Texture_01_A.png",
        "./textures/material/Texture_01_B.png",
        "./textures/material/Texture_01_C.png",
        "./textures/material/Texture_01_D.png",
        "./textures/material/Texture_01_E.png",
        "./textures/material/Texture_01_F.png",
        "./textures/material/Texture_02_A.png",
        "./textures/material/Texture_02_B.png",
        "./textures/material/Texture_02_C.png",
        "./textures/material/Texture_02_D.png",
        "./textures/material/Texture_02_E.png",
        "./textures/material/Texture_02_F.png",
        "./textures/material/Texture_03_A.png",
        "./textures/material/Texture_03_B.png",
        "./textures/material/Texture_03_C.png",
        "./textures/material/Texture_03_D.png",
        "./textures/material/Texture_03_E.png",
        "./textures/material/Texture_03_F.png",
        "./textures/material/Texture_04_A.png",
        "./textures/material/Texture_04_B.png",
        "./textures/material/Texture_04_C.png",
        "./textures/material/Texture_04_D.png",
        "./textures/material/Texture_04_E.png",
        "./textures/material/Texture_04_F.png",
    ],
}) {
    const textures = useTexture(urls);

    return (
        <TextureContext.Provider value={textures}>
            {children}
        </TextureContext.Provider>
    );
}

export default useTextures;
