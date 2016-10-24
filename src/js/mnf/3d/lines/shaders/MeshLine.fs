precision mediump float;

// uniform sampler2D map;
// uniform float useMap;

// varying vec2 vUV;
// varying vec4 vColor;
// varying vec3 vPosition;

uniform vec3 color;

void main() {

	// vec4 c = vColor;
	// if( useMap == 1. ) c *= texture2D( map, vUV );
	gl_FragColor = vec4(color,1.);

}
