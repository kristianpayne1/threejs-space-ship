varying vec2 vUv;

uniform vec3 uColor;
uniform float uTime;

void main() {
    gl_FragColor = vec4(uColor, 1.0 - log(vUv.y - 0.1) * 0.5 - 0.2 + sin(vUv.y + uTime));
}