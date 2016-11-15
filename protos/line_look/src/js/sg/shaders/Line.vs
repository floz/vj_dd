precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 previous;
attribute vec3 next;
attribute float side;
attribute float width;
attribute float id;

uniform vec2 resolution;
uniform float lineWidth;
uniform float stepX;
uniform float percentY;
uniform float strx;
uniform float stry;
uniform sampler2D tDisp;
uniform float time;

varying vec2 vUv;
varying float vId;
varying float vDisp;

vec2 fix( vec4 i, float aspect ) {
	vec2 res = i.xy / i.w;
	res.x *= aspect;
	return res;
}

void main() {
	vUv = uv;
	vId = id;

	vec3 dispPrevious = texture2D( tDisp, vec2( uv.x - stepX, percentY ) ).rgb;
	vec3 dispCurr = texture2D( tDisp, vec2( uv.x, percentY ) ).rgb;
	vec3 dispNext = texture2D( tDisp, vec2( uv.x + stepX, percentY ) ).rgb;

	float aspect = resolution.x / resolution.y;
	float pixelWidthRatio = 1. / (resolution.x * projectionMatrix[0][0]);

	mat4 m = projectionMatrix * modelViewMatrix;
	vec4 finalPosition = m * vec4( position, 1.0 );
	vec4 prevPos = m * vec4( previous, 1.0 );
	vec4 nextPos = m * vec4( next, 1.0 );

	float spacialStrPrev = 1. - distance( vec2( .5, .5 ), vec2( ( uv.x - stepX ), percentY ) ) * 1.6;
	float spacialStrCurr = 1. - distance( vec2( .5, .5 ), vec2( uv.x, percentY ) ) * 1.6;
	float spacialStrNext = 1. - distance( vec2( .5, .5 ), vec2( ( uv.x + stepX ), percentY ) ) * 1.6;

	finalPosition.x += dispCurr.g * strx * spacialStrCurr;
	prevPos.x += dispPrevious.g * strx * spacialStrPrev;
	nextPos.x += dispNext.g * strx * spacialStrNext;

	finalPosition.y += dispCurr.b * stry * spacialStrCurr;// * sin( time * .25 + vUv.x );
	prevPos.y += dispPrevious.b * stry * spacialStrPrev;// * sin( time * .25 + vUv.x );
	nextPos.y += dispNext.b * stry * spacialStrNext;// * sin( time * .25 + vUv.x );

	vDisp = dispCurr.b * stry * spacialStrPrev;

	// finalPosition.z += dispCurr.r * stry * spacialStrCurr;
	// prevPos.z += dispPrevious.r * stry * spacialStrPrev;
	// nextPos.z += dispNext.r * stry * spacialStrNext;

	vec2 currentP = fix( finalPosition, aspect );
	vec2 prevP = fix( prevPos, aspect );
	vec2 nextP = fix( nextPos, aspect );

	float pixelWidth = finalPosition.w * pixelWidthRatio;
	float w = 1.8 * lineWidth * width;
	// float w = 1.8 * pixelWidth * lineWidth * sin(width+time)*(1.-smoothstep(.9,1.,uv.x*1.));
	// w *= smoothstep(uv.x,0.,-time*2000.);
	// w *= ( 1. - smoothstep( .3, 1., uv.x * 1. ) );

	vec2 dir;
	if( nextP == currentP ) dir = normalize( currentP - prevP );
	else if( prevP == currentP ) dir = normalize( nextP - currentP );
	else {
		vec2 dir1 = normalize( currentP - prevP );
		vec2 dir2 = normalize( nextP - currentP );
		dir = normalize( dir1 + dir2 );
	}
	vec2 normal = vec2( -dir.y, dir.x );
	normal.x /= aspect;
	normal *= .5 * w;

	vec2 offset = vec2( normal * side );
	finalPosition.xy += offset.xy;

	// vPosition = ( modelViewMatrix * vec4( position, 1. ) ).xyz;
	gl_Position = finalPosition;
}
