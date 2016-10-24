#include <common>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

#include <shadowmap_pars_vertex>

varying vec2 vUv;

void main() {

  vUv = uv;

  vec3 pos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

}
