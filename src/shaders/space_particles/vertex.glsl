attribute float aBirth;

uniform float uTime;
uniform float uLifetime;
uniform float uFade;

varying float vAlpha;

void main() {
  float age = mod(uTime - aBirth, uLifetime);
  float fadeIn = smoothstep(0.0, uFade, age);
  float fadeOut = 1.0 - smoothstep(uLifetime - uFade, uLifetime, age);
  vAlpha = fadeIn * fadeOut;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 300.0 / -mvPosition.z;
}
