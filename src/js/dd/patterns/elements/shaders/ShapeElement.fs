#include <common>
#include <packing>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

uniform sampler2D tShape;
uniform vec3 color;
uniform vec3 bgColor;

varying vec2 vUv;

void main() {

  vec4 dataShape = texture2D( tShape, vUv );
  if( dataShape.a == 0. ) discard;
  gl_FragColor = vec4( color + color * bgColor * .4, 1.0 );

  #include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>

}
