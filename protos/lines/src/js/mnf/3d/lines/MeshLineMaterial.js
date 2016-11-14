
const vs = require('./shaders/MeshLine.vs')
const fs = require('./shaders/MeshLine.fs')

class MeshLineMaterial extends THREE.RawShaderMaterial{

	constructor( {lineWidth = 1, vertexShader=vs, fragmentShader=fs, resolution = new THREE.Vector2(1,1), color = 0xFFFFFF, uniforms = {} } = {}){

		uniforms.lineWidth = { type: 'f', value: lineWidth }
		uniforms.resolution = { type: 'v2', value: resolution }
		uniforms.color = { type: 'v3', value: new THREE.Color(color) }

		super( {
			uniforms:uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
		})
		this.type = 'MeshLineMaterial'
	}
}

module.exports = MeshLineMaterial
