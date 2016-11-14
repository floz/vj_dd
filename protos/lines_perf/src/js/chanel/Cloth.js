const MeshLineGPUGroupGeometry = require( "mnf/3d/lines/MeshLineGPUGroupGeometry" )
const MeshLineGPUMaterial = require( "mnf/3d/lines/MeshLineGPUMaterial" )

const Fibre = require( "./Fibre" )

const vs = require( "./shaders/Fibres.vs" )
const fs = require( "./shaders/Fibres.fs" )

const DATA = {
  space: 10
}

class Cloth extends THREE.Group {

  constructor() {
    super()

    this.countFibres = 8
    this.divisionFilins = 16

    this.createFibres()
    this.construct()
    this.setupFibres()

    // this.add( this.mesh )

    const debug = new THREE.Mesh( new THREE.PlaneBufferGeometry( 50, 50, 1, 1 ), new THREE.MeshBasicMaterial( { map: this.texture } ) )
    this.add( debug )
  }

  createFibres() {
    this.fibres = []

    this.countFilins = 0
    let py = 0
    for( let i = 0; i < this.countFibres; i++ ) {
      let fibre = new Fibre( this.divisionFilins, py )
      this.countFilins += fibre.countFilins
      this.fibres.push( fibre )

      py += DATA.space
    }
  }

  construct() {
    const width = this.countFilins * 2
    const height = this.divisionFilins

    this.size = width * height
    this.positions = new Float32Array( this.size * 4 )

    this.texture = new THREE.DataTexture( this.positions, width, height, THREE.RGBAFormat, THREE.FloatType )
    this.texture.needsUpdate = true
    this.texture.generateMipmaps = false

    // this.geometry = new MeshLineGPUGroupGeometry( width, height, width, height )
    this.geometry = new MeshLineGPUGroupGeometry( this.countFilins, this.divisionFilins, width, height )
    console.log( this.countFilins, this.divisionFilins, width, height )
    this.material = new MeshLineGPUMaterial( {
      texture: this.texture,
      width: width,
      height: height,
      lineWidth: 1,
      fragmentShader: fs,
      vertexShader: vs
    } )

    this.mesh = new THREE.Mesh( this.geometry, this.material )
  }

  setupFibres() {
    for( let i = 0; i < this.countFibres; i++ ) {
      let fibre = this.fibres[ i ]
      fibre.setup( this.texture )
    }

    console.log( this.texture )

    this.texture.needsUpdate = true
  }

}

module.exports = Cloth
