const gui = require( "mnf/utils/gui" )
const stage = require( "mnf/core/stage" )
const stage3d = require( "mnf/core/stage3d" )
const MeshLineGeometry = require( "mnf/3d/lines/MeshLineGeometry" )

const Line = require( "./Line" )
const SimpleLineDisplacementSimulation = require( "./SimpleLineDisplacementSimulation" )

class Lines extends THREE.Object3D {

  constructor( config ) {
    super()

    this.config = {
      colors: {
        hue: 75,
        background: 0xffffff//0xcabcb3
      },
      layers: {
        // count: 3,
        count: 2,
        // space: 3,
        space: 1,
        decal: 0
        // decal: 0.0001
      },
      lines: {
        space: .06,
        // count: 80,
        count: 400,
      },
      line: {
        size: .06,
        // steps: 100,
        steps: 800,
        space: .1,
        timeSpeed: .051,
        additive: false,
        luminosityStrength: .4
      },
      disp: {
        // scaleX: 0.7001,
        // scaleY: 0.9001,
        scaleX: 1.1201,
        scaleY: 1.2101,
        // scaleX: 1.001,
        // scaleY: 1.001,
        perx: 0.211,
        pery: 0.211,
        rot: 0.0,
        // strx: 0.02,
        strx: 0.05,
        stry: 0.14,
        // stry: 2.4,
        timeFriction: .0005
      }
    }

    this.sims = []

    const fColors = gui.addFolder( "Colors" )
    fColors.add( this.config.colors, "hue", 0, 360, 1 ).onChange( this.refreshColors )
    fColors.addColor( this.config.colors, "background" ).onChange( this.refreshBackground )
    fColors.open()

    const fLayers = gui.addFolder( "Layers" )
    fLayers.add( this.config.layers, "count", 1, 30, 1 ).onChange( this.build )
    fLayers.add( this.config.layers, "space", 1, 20, .1 ).onChange( this.build )
    fLayers.add( this.config.layers, "decal", 0, 20, .01 ).onChange( this.build )
    fLayers.open()

    const fLines = gui.addFolder( "Lines" )
    fLines.add( this.config.lines, "space", 0.1, 6, .1 ).onChange( this.build )
    fLines.add( this.config.lines, "count", 60, 600, 1 ).onChange( this.build )
    fLines.open()

    const fLine = gui.addFolder( "Line" )
    fLine.add( this.config.line, "size", 0.001, 1, .001 ).onChange( this.build )
    // fLine.add( this.config.line, "steps", 10, 200, 1 ).onChange( this.build )
    fLine.add( this.config.line, "space", 0.1, 10, .1 ).onChange( this.build )
    fLine.add( this.config.line, "timeSpeed", 0.001, 1, .001 )
    fLine.add( this.config.line, "luminosityStrength", 0.01, 1, .01 )
    fLine.add( this.config.line, "additive" ).onChange( this.changeAdditive )
    fLine.open()

    const fDisp = gui.addFolder( "disp" )
    fDisp.add( this.config.disp, "scaleX", 0, 2, .01 ).onChange( this.refreshDisp )
    fDisp.add( this.config.disp, "scaleY", 0, 2, .01 ).onChange( this.refreshDisp )
    fDisp.add( this.config.disp, "perx", 0, 1, .01 ).onChange( this.refreshDisp )
    fDisp.add( this.config.disp, "pery", 0, 1, .01 ).onChange( this.refreshDisp )
    fDisp.add( this.config.disp, "rot", -Math.PI, Math.PI, .01 ).onChange( this.refreshDisp )
    fDisp.add( this.config.disp, "strx", 0, 5, .01 ).onChange( this.refreshLines )
    fDisp.add( this.config.disp, "stry", 0, 5, .01 ).onChange( this.refreshLines )
    fDisp.add( this.config.disp, "timeFriction", 0.00001, .001, .00001 ).onChange( this.refreshDisp )
    fDisp.open()

    this.build()
    this.refreshBackground()
    this.refreshDisp()

    stage.onUpdate.add( this.onUpdate )
  }

  build = () => {
    this.reset()

    this.lines = []

    this.pGeo =  []
    let p = -( this.config.line.steps * this.config.line.space ) * .5
    for( let i = 0; i < this.config.line.steps; i++ ) {
      this.pGeo.push( p, 0, 0 )
      p += this.config.line.space
    }
    this.geo = new MeshLineGeometry( this.pGeo )

    let r = this.config.disp.rot
    let rAdd = Math.PI / this.config.layers.count

    let y = 0
    let decal = 0
    for( let i = 0; i < this.config.layers.count; i++ ) {
      this.buildLayer( y, decal, 1 - i / this.config.layers.count, r, i )
      y -= this.config.layers.space
      decal += this.config.layers.decal
      r += rAdd
    }
  }

  buildLayer( y = 0, decal = 0, alpha = 1, rMod = 0, idx = 0 ) {
    const dispSim = new SimpleLineDisplacementSimulation( this.config.line.steps, this.config.lines.count, rMod )
    // stage3d.add( dispSim.getDebugMesh() )
    this.sims.push( dispSim )

    // const mat = new MeshLineMaterial( { lineWidth: this.config.line.size, uniforms: uniforms, fragmentShader: fs, vertexShader: vs })
    // mat.transparent = true
    // mat.depthWrite = false
    // mat.blending = THREE.OneMinusSrcAlphaFactor

    const colorsA = [ 0x7f7a80, 0x000000, 0x000000, 0x9e9268, 0xb6931d, 0x000000,0x9e9268, 0xb6931d, 0x7f7a80, 0x000000, 0x000000, 0x9e9268, 0xb6931d, 0x000000,0x9e9268, 0xb6931d, 0xfc0003, 0x9e9268, 0xb6931d, 0x9e9268, 0x7f7a80 ]
    const colorsB = [ 0xd1d1d3, 0x2b2828, 0x2b2828, 0xeae2cb, 0xded971, 0x2b2828,0xeae2cb, 0xded971, 0xd1d1d3, 0x2b2828, 0x2b2828, 0xeae2cb, 0xded971, 0x2b2828,0xeae2cb, 0xded971, 0x9c0006, 0xeae2cb, 0xded971, 0xeae2cb, 0xd1d1d3 ]

    let p = -( this.config.lines.count * this.config.lines.space ) * .5
    p += decal
    let idxColor = 0
    let idxBright = 0
    for( let i = 0; i < this.config.lines.count; i++ ) {
      let line = new Line( this.geo, this.config.line, alpha, i / this.config.lines.count, dispSim.rt.texture, this.config.disp )
      // line.setColor( this.config.colors.hue, alpha )
      line.setColorB( colorsA[ idxColor ], colorsB[ idxColor ], idxBright )
      line.position.y = y
      line.position.z = p
      if( idx % 1 == 0 && idx != 0 ) {
        // line.rotation.y += Math.PI
      }
      this.add( line )

      this.lines.push( line )

      p += this.config.lines.space
      idxBright++
      if( i % 3 == 0 && i != 0 ) {
        // p += .08
        idxColor++
        idxBright = 0
        if( idxColor >= colorsA.length ) {
          idxColor = 0
        }
      }
    }
  }

  refreshColors = () => {
    for( let i = 0, n = this.lines.length; i < n; i++ ) {
      this.lines[ i ].setHUE( this.config.colors.hue )
    }
  }

  refreshDisp = () => {
    for( let i = 0, n = this.sims.length; i < n; i++ ) {
      this.sims[ i ].update( this.config.disp.scaleX, this.config.disp.scaleY, this.config.disp.perx, this.config.disp.pery, this.config.disp.rot, this.config.disp.timeFriction )
    }
    // this.dispSim.update( this.config.disp.scaleX, this.config.disp.scaleY, this.config.disp.perx, this.config.disp.pery, this.config.disp.rot )
  }

  refreshLines = () => {
    for( let i = 0, n = this.lines.length; i < n; i++ ) {
      this.lines[ i ].refreshDisp()
    }
  }

  changeAdditive = () => {
    for( let i = 0, n = this.lines.length; i < n; i++ ) {
      this.lines[ i ].setAdditive( this.config.line.additive )
    }
  }

  onUpdate = () => {
    let i = this.lines.length
    while( --i > -1 ) {
      this.lines[ i ].update()
    }

    // i = this.sims.length
    // while( --i > -1 ) {
    //   this.sims[ i ].update()
    // }
    this.refreshDisp()
    // this.sims[ 0 ].update()
    // this.sims[ 0 ].getDebugMesh().lookAt( stage3d.camera.position )
  }

  refreshBackground = () => {
    stage3d.setBackgroundColor( this.config.colors.background )
  }

  reset() {
    if( !this.lines ) {
      return
    }

    this.sims = []

    let i = this.lines.length
    while( --i > -1 ) {
      this.remove( this.lines[ i ] )
    }
  }

}

module.exports = Lines
