#define PI 3.14159265359

uniform sampler2D tInput;
varying vec2 vUv;

uniform float gamma;
uniform float contrast;
uniform float brightness;

uniform float mirrorX;
uniform float mirrorY;
// uniform float MirrorRadial;
uniform float divide4;
uniform float vignetteFallOff;
uniform float vignetteAmount;
uniform float invertRatio;

uniform float amount;
uniform float speed;
uniform float time;

highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
vec3 toGamma( vec3 rgb ) {
  return pow( rgb, vec3( 1.0 / gamma ) );
}

void main() {
	vec2 uv = vUv;
  if(divide4>0.){ uv *= 2.; uv = mod(uv,vec2(1.)); }
	if(mirrorX>0.){ uv.x = abs(uv.x-.5)+.5; }
	if(mirrorY>0.){ uv.y = abs(uv.y-.5)+.5; }

	vec4 color = texture2D(tInput, uv);

  // rgb modifs
	vec3 rgb = toGamma( color.rgb );
	rgb = rgb * contrast;
	rgb = rgb + vec3( brightness );

  // noise
	float dx = rand( vUv * 100. );
  rgb += rgb * clamp( 0.1 + dx, 0.0, 1.0 ) * .125;

	// //invert
	rgb = mix(rgb, (1. - rgb),invertRatio);

	// //Vignette
	float dist = distance(uv, vec2(0.5, 0.5));
	rgb *= smoothstep(0.8, vignetteFallOff * 0.799, dist * (vignetteAmount + vignetteFallOff));

	gl_FragColor = vec4( rgb, 1. );

}
