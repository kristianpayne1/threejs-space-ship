import Gun from "./Gun";

function Guns({ guns = [] }) {
    return (
        <group>
            {guns.map(({ type, ...gunProps }, index) => (
                <Gun key={index} type={type} {...gunProps} />
            ))}
        </group>
    );
}

export default Guns;
