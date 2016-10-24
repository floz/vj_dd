#include <common>
#include <packing>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

uniform sampler2D tShape;
uniform vec3 color;

varying vec2 vUv;

void main() {

  vec4 dataShape = texture2D( tShape, vUv );
  if( dataShape.a == 0. ) discard;
  gl_FragColor = vec4( color, 1. );

  #include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>

}
