import { Line } from "@react-three/drei";

function LaserGun(props) {
    return (
        <Line
            points={[
                [0, 0, 2.5],
                [0, 0, 200],
            ]}
            lineWidth={4}
            color={"grey"}
            dashed={true}
            dashSize={2}
            dashOffset={16}
            {...props}
        />
    );
}

export default LaserGun;
