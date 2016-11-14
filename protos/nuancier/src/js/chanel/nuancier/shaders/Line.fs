precision highp float;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
{
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  // Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  //Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}


uniform sampler2D tex;
uniform sampler2D texIrr1;
uniform sampler2D texIrr2;
uniform sampler2D texNoise1;
uniform sampler2D texNoise2;
uniform vec3 color;
uniform vec3 colorOpp;
uniform float alpha;
uniform float percentY;
uniform float time;
uniform float texSize;
uniform float texSizeNoise;
uniform sampler2D tDisp;
uniform float uID;
uniform float luminosityStrength1;
uniform float luminosityStrength2;
uniform float luminosityStrengthNoise;
uniform float brightness;
uniform float vDispNoise;

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
  uv2.x = cos( time * .01 + uv2.x * texSize ) * texSize;

  vec2 uvnoise = vUv;
  // uvnoise.x = mod( uvnoise.x + vDispNoise, 1. );// + time * .05;
  uvnoise.x = uvnoise.x + time * .05;

  float vNoise = snoise( vec3( uv2, rand( uv ) ) );

	vec3 disp = texture2D( tDisp, vec2( vUv.x * .5, percentY ) ).rgb;

	vec3 newColor = color * ( 1. - disp.r ) + colorOpp * disp.r;
	// vec3 newColor = color;

	vec4 result = vec4( newColor, alpha * cubicOut( 1. - vUv.y ) );
	// vec4 result = vec4( newColor, 1. );
	result *= texture2D( tex, vUv );

  vec3 rgb = result.rgb;
  // result.rgb += rgb * vec3( cos( vUv.x * 200. + time * 2. ) ) * .1;

  // result.rgb = vec3( 1., 0., 1. ) * ( disp.b );
  // result.rgb += brightness * abs( max( 0., disp.b ) * ( rgb * luminosityStrength1 ) * texture2D( texIrr1, vec2( uv2.x * 5., uv.y ) ).r * sin( time * 5. ) );
  result.rgb += brightness * abs( max( 0., min( disp.b, .8 ) ) * ( rgb * luminosityStrength2 ) * texture2D( texIrr2, vec2( uv2.x * 5., uv.y ) ).r * ( 1. - sin( time * 5. ) ) );
  result.rgb += brightness * vNoise * rgb * .5;
  // result.rgb += rgb * texture2D( texIrr1, vec2( uv.x * 10., uv.y ) ).r * sin( time * .001 );

  // result.rgba = texture2D( texNoise1, vec2( vUv.x * 10., vUv.y * 2. ) ).rgba;
  // result.rgb += brightness * abs( rgb * luminosityStrengthNoise * texture2D( texNoise2, vec2( uv.x * texSizeNoise, uv.y * 1. ) ).r * 4. );
  result.rgb += brightness * abs( rgb * luminosityStrengthNoise * texture2D( texNoise2, vec2( uvnoise.x * texSizeNoise, uvnoise.y ) ).r );

	gl_FragColor = result;

}
