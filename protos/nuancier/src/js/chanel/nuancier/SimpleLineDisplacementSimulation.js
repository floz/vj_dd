const stage3d = require('mnf/core/stage3d')

class SimpleLineDisplacementSimulation {

  constructor( width, height, rMod ) {
    this.width = width * 4
    this.height = height * 4
    this.rMod = rMod

    this.renderer = stage3d.renderer

    const options = {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat,
			type: THREE.FloatType,
			encoding: THREE.LinearEncoding,
			stencilBuffer: true,
			depthBuffer: false,
		}

    this.rt = new THREE.WebGLRenderTarget( this.width, this.height, options )
    this.rt.texture.generateMipmaps = false

    this.scene = new THREE.Scene()
    this.orthoCamera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0, 1 )

    this.mesh =  new THREE.Mesh( new THREE.PlaneBufferGeometry( 1, 1, 1, 1 ) )
		this.scene.add( this.mesh )

    this.time = Math.random() * 1000
    this.simMaterial = new THREE.ShaderMaterial( {
			uniforms: {
        time: { type: "f", value: this.time },
        scaleX: { type: "f", value: 1.001 },
        scaleY: { type: "f", value: 1.001 },
        perx: { type: "f", value: 0 },
        pery: { type: "f", value: 0 },
        rot: { type: "f", value: rMod },
        timeFriction: { type: "f", value: 0.0005 },
			},
			vertexShader: require( "fbo/copy.vs" ),
			fragmentShader: require( "./shaders/displacementSimulation.fs" ),
			depthWrite: false,
			depthTest: false,
		} )

    this.mesh.material = this.simMaterial
  }

  getDebugMesh() {
    if( !this.debugMesh ) {
      this.debugMesh = this.createDebugMesh()
    }
    return this.debugMesh
  }

  createDebugMesh() {
    const geo = new THREE.PlaneBufferGeometry( this.width / 5, this.height / 5 )
    const mat = new THREE.ShaderMaterial( {
			uniforms: {
        t_pos: { type: "t", value: this.rt.texture }
			},
			vertexShader: require( "fbo/copy.vs" ),
			fragmentShader: require( "fbo/copy.fs" ),
			depthWrite: false,
			depthTest: false,
		} )
    return new THREE.Mesh( geo, mat )
  }

  update( scaleX = 1.001, scaleY = 1.001, perx = 0, pery = 0, rot = 0, timeFriction ) {
    this.time++

    this.simMaterial.uniforms.time.value = this.time
    this.simMaterial.uniforms.scaleX.value = scaleX
    this.simMaterial.uniforms.scaleY.value = scaleY
    this.simMaterial.uniforms.perx.value = perx
    this.simMaterial.uniforms.pery.value = pery
    this.simMaterial.uniforms.rot.value = rot + this.rMod
    this.simMaterial.uniforms.timeFriction.value = .0005

    this.renderer.render( this.scene, this.orthoCamera, this.rt, false )
  }

}

module.exports = SimpleLineDisplacementSimulation
