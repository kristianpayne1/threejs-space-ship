varying vec2 vUv;

uniform vec3 uColor;

void main() {
    gl_FragColor = vec4(uColor, 1.0 - log(vUv.y - 0.1) * 0.6 - 0.9);
}