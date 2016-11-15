const MeshLineMaterial = require( "mnf/3d/lines/MeshLineMaterial" )

const fs = require( "./shaders/Line.fs" )
const vs = require( "./shaders/Line.vs" )

const core = require( "./core" )

const TEX_RELIEF = new THREE.TextureLoader().load( "./textures/line_relief.jpg" )
TEX_RELIEF.wrapS = THREE.RepeatWrapping
TEX_RELIEF.wrapT = THREE.RepeatWrapping

const TEX_DETAILS = new THREE.TextureLoader().load( "./textures/line_details.jpg" )
TEX_DETAILS.wrapS = THREE.RepeatWrapping
TEX_DETAILS.wrapT = THREE.RepeatWrapping

const TEX_DETAILS2 = new THREE.TextureLoader().load( "./textures/line_details2.jpg" )
TEX_DETAILS2.wrapS = THREE.RepeatWrapping
TEX_DETAILS2.wrapT = THREE.RepeatWrapping

const TEX_BRIGHTNESS = new THREE.TextureLoader().load( "./textures/line_brightness.jpg" )
TEX_BRIGHTNESS.wrapS = THREE.RepeatWrapping
TEX_BRIGHTNESS.wrapT = THREE.RepeatWrapping

const TEX_BRIGHTNESS2 = new THREE.TextureLoader().load( "./textures/line_brightness2.jpg" )
TEX_BRIGHTNESS2.wrapS = THREE.RepeatWrapping
TEX_BRIGHTNESS2.wrapT = THREE.RepeatWrapping

class Line extends THREE.Mesh {

  constructor( geo, lineWidth, color, normal ) {
    const rand = core.random()

    const uniforms = {}
    uniforms.texRelief = { type: "t", value: TEX_RELIEF }
    uniforms.texDetails = { type: "t", value: rand < .5 ? TEX_DETAILS2 : TEX_DETAILS }
    uniforms.texBrightness = { type: "t", value: rand < .5 ? TEX_BRIGHTNESS2 : TEX_BRIGHTNESS }
    uniforms.colorA = { type: "c", value: color.a }
    uniforms.colorB = { type: "c", value: color.b }
    uniforms.normal = { type: "v2", value: normal }
    uniforms.time = { type: "f", value: Math.random() * 1000 }
    uniforms.speedFactor = { type: "f", value: color.speedFactor }
    uniforms.brightnessFactor = { type: "f", value: color.brightnessFactor }
    uniforms.flickeringFactor = { type: "f", value: color.flickeringFactor }
    uniforms.texRepeatDetails = { type: "f", value: color.texRepeatDetails }
    uniforms.texRepeatBrightness = { type: "f", value: color.texRepeatBrightness }

    const mat = new MeshLineMaterial( { lineWidth: lineWidth, uniforms: uniforms, fragmentShader: fs, vertexShader: vs })
    mat.side = THREE.DoubleSide

    super( geo, mat )

    this.color = color
  }

  update( globalSpeedFactor ) {
    this.material.uniforms.time.value += globalSpeedFactor
    this.material.uniforms.speedFactor.value = this.color.speedFactor
    this.material.uniforms.brightnessFactor.value = this.color.brightnessFactor
    this.material.uniforms.flickeringFactor.value = this.color.flickeringFactor
    this.material.uniforms.texRepeatDetails.value = this.color.texRepeatDetails
    this.material.uniforms.texRepeatBrightness.value = this.color.texRepeatBrightness
  }

}

module.exports = Line
