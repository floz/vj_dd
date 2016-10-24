precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 previous;
attribute vec3 next;
attribute float side;
attribute float width;

uniform vec2 resolution;
uniform float lineWidth;

vec2 fix( vec4 i, float aspect ) {
	vec2 res = i.xy / i.w;
	res.x *= aspect;
	return res;
}

void main() {

	float aspect = resolution.x / resolution.y;
	float pixelWidthRatio = 1. / (resolution.x * projectionMatrix[0][0]);

	mat4 m = projectionMatrix * modelViewMatrix;
	vec4 finalPosition = m * vec4( position, 1.0 );
	vec4 prevPos = m * vec4( previous, 1.0 );
	vec4 nextPos = m * vec4( next, 1.0 );

	vec2 currentP = fix( finalPosition, aspect );
	vec2 prevP = fix( prevPos, aspect );
	vec2 nextP = fix( nextPos, aspect );

	float pixelWidth = finalPosition.w * pixelWidthRatio;
	float w = 1.8 * lineWidth * width;

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
