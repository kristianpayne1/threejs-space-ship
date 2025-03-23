import { createContext, useContext, useEffect } from "react";
import { AudioListener } from "three";

const audioListener = new AudioListener();
const AudioContext = createContext(audioListener);

function useAudioListener() {
    return useContext(AudioContext);
}

export function AudioListenerProvider({ children, enabled = true }) {
    useEffect(() => {
        if (enabled) audioListener.setMasterVolume(1);
        else audioListener.setMasterVolume(0);
    }, [enabled]);

    return (
        <AudioContext.Provider value={audioListener}>
            {children}
        </AudioContext.Provider>
    );
}

export default useAudioListener;
