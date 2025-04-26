import useTextures from "./useTextures.jsx";
import { useEffect, useState } from "react";
import { SRGBColorSpace } from "three";

function useCurrentTexture(ref) {
    const [textureIndex, setTextureIndex] = useState(1);

    const textures = useTextures();

    // swap texture
    useEffect(() => {
        if (!textures.length || !ref.current) return;
        const texture = textures[textureIndex % textures.length];
        texture.colorSpace = SRGBColorSpace;
        texture.flipY = false;
        texture.needsUpdate = true;
        ref.current.material.map = texture;
    }, [textureIndex, ref, textures]);

    return [textureIndex, setTextureIndex];
}

export default useCurrentTexture;
