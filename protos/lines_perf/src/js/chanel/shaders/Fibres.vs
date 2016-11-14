
// uniform mat4 projectionMatrix;
// uniform mat4 modelViewMatrix;
uniform sampler2D positions;

attribute vec2 ID;
attribute vec2 prevID;
attribute vec2 nextID;
// attribute vec2 uv;
attribute float side;

uniform vec2 resolution;
uniform float lineWidth;
varying vec2 vUv;

vec2 fix( vec4 i, float aspect ) {
	vec2 res = i.xy / i.w;
	res.x *= aspect;
	return res;
}

void main() {

	float aspect = resolution.x / resolution.y;

	mat4 m = projectionMatrix * modelViewMatrix;
	vUv = uv;
	vec4 txt = texture2D(positions,ID).rgba;
	vec4 finalPosition = m * vec4( txt.rgb, 1.0 );
	vec4 prevPos = m * vec4( texture2D(positions,prevID).rgb, 1.0 );
	vec4 nextPos = m * vec4( texture2D(positions,nextID).rgb, 1.0 );

	vec2 prevP = fix( prevPos, aspect );
	vec2 nextP = fix( nextPos, aspect );

	vec2 dir = normalize( nextP - prevP );
	finalPosition.xy += vec2( -dir.y/aspect, dir.x ) * lineWidth * side;
	// finalPosition.xy = ID;
	// finalPosition.z = 1.;
	gl_Position = finalPosition;
}
