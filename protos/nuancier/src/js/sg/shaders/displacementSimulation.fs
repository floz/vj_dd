$psrdnoise2D

uniform float time;
uniform float perx;
uniform float pery;
uniform float rot;
uniform float scaleX;
uniform float scaleY;
uniform float timeFriction;

varying vec2 vUv;

void main() {

	// vec4 color = vec4( vUv.x, vUv.y, 0., 1. );
  // float value = srnoise( vUv, .15 );
  // vec4 color = vec4( value, 0., 0., 1. );

  // vec3 value = sdnoise( vUv );
  // vec4 color = vec4( value, 1. );
  vec2 uvRemapped = vec2( vUv.x, 1. - vUv.y );
  vec2 uvScaled = vec2( uvRemapped.x * scaleX, uvRemapped.y * scaleY );

  vec3 value = psrdnoise( uvScaled, vec2( perx, pery ), rot + time * timeFriction * .5 );
  value = psrdnoise( vec2( value.y, value.z ), vec2( perx, pery ), rot + time * timeFriction );
  vec4 color = vec4( value, 1. );

	gl_FragColor = color;

}
