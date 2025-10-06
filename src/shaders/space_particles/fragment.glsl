precision mediump float;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float circle = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vec3(1.0), circle * vAlpha);
}
