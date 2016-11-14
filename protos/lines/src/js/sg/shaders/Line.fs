precision highp float;

uniform sampler2D tex;
uniform sampler2D texIrr1;
uniform sampler2D texIrr2;
uniform vec3 color;
uniform vec3 colorOpp;
uniform float alpha;
uniform float percentY;
uniform float time;
uniform float texSize;
uniform sampler2D tDisp;
uniform float uID;
uniform float luminosityStrength;

varying vec2 vUv;
varying float vId;
varying float vDisp;

float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

void main() {
	vec2 uv = vUv;
	uv.x = cos( time * .01 + uv.x * texSize ) * texSize;

  vec2 uv2 = vUv;
  uv2.x = cos( uv2.x * texSize ) * texSize;

	vec3 disp = texture2D( tDisp, vec2( vUv.x, percentY ) ).rgb;

	vec3 newColor = color * ( 1. - disp.r ) + colorOpp * disp.r;

	vec4 result = vec4( newColor, alpha * cubicOut( 1. - vUv.y ) );
	result *= texture2D( tex, uv );

  vec3 rgb = result.rgb;
  // result.rgb += rgb * vec3( cos( vUv.x * 200. + time * 2. ) ) * .1;

  // result.rgb = vec3( 1., 0., 1. ) * ( disp.b );
  result.rgb += abs( max( 0., disp.b ) * ( rgb * luminosityStrength ) * texture2D( texIrr1, vec2( uv2.x * 10., uv.y ) ).r * sin( time * 5. ) );
  result.rgb += abs( max( 0., disp.b ) * ( rgb * luminosityStrength ) * texture2D( texIrr2, vec2( uv2.x * 10., uv.y ) ).r * ( 1. - sin( time * 5. ) ) );
  // result.rgb += rgb * texture2D( texIrr1, vec2( uv.x * 10., uv.y ) ).r * sin( time * .001 );

	gl_FragColor = result;

}
