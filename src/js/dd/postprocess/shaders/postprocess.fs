#define PI 3.14159265359

uniform sampler2D tInput;
varying vec2 vUv;

uniform float gamma;
uniform float contrast;
uniform float brightness;

uniform float mirrorX;
uniform float mirrorY;
// uniform float MirrorRadial;
uniform float angle;
uniform float divide4;
uniform float vignetteFallOff;
uniform float vignetteAmount;
uniform float invertRatio;
uniform float sectionsKaleid;
uniform float kaleidActivated;

uniform float amount;
uniform float speed;
uniform float time;

const float TAU = 2. * PI;

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

	float sin_factor = sin(angle);
  float cos_factor = cos(angle);
  vec2 origin = vec2(0.5 ,0.5);

  vec2 temp = (uv - origin);

  temp = temp * mat2(cos_factor, sin_factor, -sin_factor, cos_factor);

  uv = (temp + origin);

	vec2 pos = vec2( uv - .5 );

	float rad = length(pos);
  float a = atan(pos.y, pos.x);

  float ma = mod(a, TAU/sectionsKaleid);
  ma = abs(ma - PI/sectionsKaleid);

  float x = cos(ma) * rad;
  float y = sin(ma) * rad;

	vec4 color = texture2D(tInput, vec2( x, y ) ) * kaleidActivated + texture2D(tInput, uv ) * ( 1. - kaleidActivated );

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
