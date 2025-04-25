import { useEffect, useState } from "react";

function handleWindowPointerOver(setIsOver) {
    return function () {
        setIsOver(true);
    };
}

function handleWindowPointerOut(setIsOver) {
    return function () {
        setIsOver(false);
    };
}

function useIsOver() {
    const [isOver, setIsOver] = useState(false);

    useEffect(() => {
        window.addEventListener(
            "pointerover",
            handleWindowPointerOver(setIsOver),
        );
        window.addEventListener(
            "pointerout",
            handleWindowPointerOut(setIsOver),
        );

        return () => {
            window.removeEventListener(
                "pointerover",
                handleWindowPointerOver(setIsOver),
            );
            window.removeEventListener(
                "pointerout",
                handleWindowPointerOut(setIsOver),
            );
        };
    }, []);

    return isOver;
}

export default useIsOver;
