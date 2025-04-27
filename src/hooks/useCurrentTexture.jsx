import useTextures from "./useTextures.jsx";
import { SRGBColorSpace } from "three";
import { createContext, useContext, useEffect, useState } from "react";

const CurrentTextureContext = createContext([0, () => {}]);

export function CurrentTextureProvider({ children }) {
    const [textureIndex, setTextureIndex] = useState(0);
    return (
        <CurrentTextureContext.Provider value={[textureIndex, setTextureIndex]}>
            {children}
        </CurrentTextureContext.Provider>
    );
}

function useCurrentTexture(ref) {
    const [textureIndex, setTextureIndex] = useContext(CurrentTextureContext);
    const textures = useTextures();

    useEffect(() => {
        if (!textures.length || !ref.current) return;

        const texture = textures[textureIndex % textures.length];
        texture.colorSpace = SRGBColorSpace;
        texture.flipY = false;
        texture.needsUpdate = true;
        ref.current.material.map = texture;
    }, [ref, textureIndex, textures]);

    return [textureIndex, setTextureIndex];
}

export default useCurrentTexture;
