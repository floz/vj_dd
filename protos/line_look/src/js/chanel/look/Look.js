const stage = require( "mnf/core/stage" )
const stage3d = require( "mnf/core/stage3d" )
const MeshLineGeometry = require( "mnf/3d/lines/MeshLineGeometry" )

const gui = require( "mnf/utils/gui" )

const dataColors = require( "./dataColors" )
const Line = require( "./Line" )

class Look {

  constructor() {
    this.data = {
      linePerLayer: 60,
      lineWidth: .28,
      lineLength: 98,
      lineSpacing: .701,
      lineSteps: 72,
      lineWaveElevation: 0.21,

      globalSpeedFactor: 1.01
    }

    this.options = {
      data: [
        {
          linePerLayer: 60,
          lineWidth: .28,
          lineLength: 98,
          lineSpacing: .7,
        },
        {
          linePerLayer: 20,
          lineWidth: .4,
          lineLength: 26,
          lineSpacing: 1.001,
        },
      ],
      setOption1: () => {
        const option = this.options.data[ 0 ]
        this.data.linePerLayer = option.linePerLayer
        this.data.lineWidth = option.lineWidth
        this.data.lineLength = option.lineLength
        this.data.lineSpacing = option.lineSpacing
        this.init()
      },
      setOption2: () => {
        const option = this.options.data[ 1 ]
        this.data.linePerLayer = option.linePerLayer
        this.data.lineWidth = option.lineWidth
        this.data.lineLength = option.lineLength
        this.data.lineSpacing = option.lineSpacing
        this.init()
      }
    }

    this.colorsInOrder = [
      dataColors.getSilver(),
      dataColors.getBlack(),
      dataColors.getBlack(),
      dataColors.getGoldLight(),
      dataColors.getGold(),
      dataColors.getBlack(),
      dataColors.getGoldLight(),
      dataColors.getGold(),
      dataColors.getSilver(),
      dataColors.getBlack(),
      dataColors.getGoldLight(),
      dataColors.getGold(),
      dataColors.getRed(),
      dataColors.getGoldLight(),
      dataColors.getGold(),
      dataColors.getGoldLight(),
    ]
    this.colorsOrderCount = this.colorsInOrder.length

    const f = gui.addFolder( "Lines" )
    f.add( this.data, "linePerLayer", 3, 100, 1 ).onChange( this.construct )
    f.add( this.data, "lineWidth", 0, 5, .01 ).onChange( this.onUpdateLineWidth )
    f.add( this.data, "lineLength", 5, 150, 1 ).onChange( this.init )
    f.add( this.data, "lineSpacing", .05, 10, .001 ).onChange( this.init )
    f.add( this.data, "lineSteps", 10, 100, 1 ).onChange( this.init )
    f.add( this.data, "lineWaveElevation", .01, 2, .01 ).onChange( this.init )
    f.add( this.data, "globalSpeedFactor", .1, 5, .01 ).onChange( this.init )
    f.add( this.options, "setOption1" )
    f.add( this.options, "setOption2" )
    f.open()

    this.init()

    stage.onUpdate.add( this.onUpdate )
  }

  init = () => {
    this.createVerticalGeo()
    this.createHorizontalGeo()
    this.construct()

    // stage3d.add( new THREE.Mesh( new THREE.SphereBufferGeometry( 1, 32, 32 ), new THREE.MeshBasicMaterial( { color: 0x00ff00 } ) ) )
  }

  createVerticalGeo() {
    const points = []

    let y = -this.data.lineLength * .5
    let z = 0
    const step = this.data.lineLength / this.data.lineSteps
    for( let i = 0; i < this.data.lineSteps; i++ ) {
      points.push( 0, y, z )
      y += step

      z = Math.sin( y ) * this.data.lineWaveElevation
    }
    this.geoVertical = new MeshLineGeometry( points )
  }

  createHorizontalGeo() {
    const points = []

    let x = -this.data.lineLength * .5
    let z = 0
    const step = this.data.lineLength / this.data.lineSteps
    for( let i = 0; i < this.data.lineSteps; i++ ) {
      points.push( x, 0, z )
      x += step

      z = Math.cos( x ) * this.data.lineWaveElevation
    }
    this.geoHorizontal = new MeshLineGeometry( points )
  }

  construct = () => {
    this.erase()

    this.isConstructed = true
    this.lines = []

    this.createVerticalLayer()
    this.createHorizontalLayer()
  }

  erase() {
    if( !this.isConstructed ) {
      return
    }
    this.eraseLines()
  }

  eraseLines() {
    for( let i = 0, n = this.lines.length; i < n; i++ ) {
      stage3d.remove( this.lines[ i ] )
    }
  }

  createVerticalLayer() {
    const normal = new THREE.Vector2( 1., 0. )

    let x = -( ( this.data.linePerLayer - 1 ) * .5 ) * ( this.data.lineWidth * .5 + this.data.lineSpacing ) //-( this.data.linePerLayer - 0 ) * this.data.lineWidth * this.data.lineSpacing
    let y = 0
    for( let i = 0; i < this.data.linePerLayer; i++ ) {
      let color = this.colorsInOrder[ i % this.colorsOrderCount ]
      let line = new Line( this.geoVertical, this.data.lineWidth, color, normal )
      line.position.set( x, y, 0 )
      stage3d.add( line )

      this.lines.push( line )

      x += this.data.lineWidth * .5 + this.data.lineSpacing
    }
  }

  createHorizontalLayer() {
    const normal = new THREE.Vector2( 0., 1. )

    let y = -( ( this.data.linePerLayer - 1 ) * .5 ) * ( this.data.lineWidth * .5 + this.data.lineSpacing )//-( this.data.linePerLayer - 0 ) * this.data.lineWidth * this.data.lineSpacing
    let x = 0
    for( let i = 0; i < this.data.linePerLayer; i++ ) {
      let color = this.colorsInOrder[ i % this.colorsOrderCount ]
      let line = new Line( this.geoHorizontal, this.data.lineWidth, color, normal )
      line.position.set( x, y, 0 )
      stage3d.add( line )

      this.lines.push( line )

      y += this.data.lineWidth * .5 + this.data.lineSpacing
    }
  }

  onUpdateLineWidth = () => {
    for( let i = 0, n = this.lines.length; i < n; i++ ) {
      this.lines[ i ].material.uniforms.lineWidth.value = this.data.lineWidth
    }
  }

  onUpdate = () => {
    for( let i = 0, n = this.lines.length; i < n; i++ ) {
      this.lines[ i ].update( this.data.globalSpeedFactor )
    }
  }

}

module.exports = Look
