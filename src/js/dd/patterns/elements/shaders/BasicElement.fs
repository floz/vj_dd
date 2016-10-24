#include <common>
#include <packing>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

uniform vec3 color;
uniform vec3 bgColor;

void main() {

  gl_FragColor = vec4( color + color * bgColor * .4, 1.0 );

  #include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>

}
