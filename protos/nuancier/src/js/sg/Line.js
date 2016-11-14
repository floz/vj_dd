const MeshLineMaterial = require( "mnf/3d/lines/MeshLineMaterial" )

const fs = require( "./shaders/Line.fs" )
const vs = require( "./shaders/Line.vs" )

const TEX = new THREE.TextureLoader().load( "./textures/stroke.png" )
TEX.wrapS = THREE.RepeatWrapping
TEX.wrapT = THREE.RepeatWrapping

const TEX2 = new THREE.TextureLoader().load( "./textures/stroke2.png" )
TEX2.wrapS = THREE.RepeatWrapping
TEX2.wrapT = THREE.RepeatWrapping

const TEX3 = new THREE.TextureLoader().load( "./textures/stroke3.png" )
TEX3.wrapS = THREE.RepeatWrapping
TEX3.wrapT = THREE.RepeatWrapping

const TEXIRR1 = new THREE.TextureLoader().load( "./textures/stroke_irr1.png" )
TEXIRR1.wrapS = THREE.RepeatWrapping
TEXIRR1.wrapT = THREE.RepeatWrapping

const TEXIRR2 = new THREE.TextureLoader().load( "./textures/stroke_irr2.png" )
TEXIRR2.wrapS = THREE.RepeatWrapping
TEXIRR2.wrapT = THREE.RepeatWrapping

const TEXS = [ TEX, TEX2, TEX3 ]

class Line extends THREE.Mesh {

  constructor( geo, config, alpha, pY, tex, configDisp ) {
    // const pGeo = []
    // let p = -( config.steps * config.space ) * .5
    // for( let i = 0; i < config.steps; i++ ) {
    //   pGeo.push( p, 0, 0 )
    //   p += config.space
    // }
    // const geo = new MeshLineGeometry( pGeo )

    const idx = TEXS.length * Math.random() >> 0
    const lineTex = TEXS[ idx ]

    if( alpha == 0 ) {
      alpha = .1
    }


    let time = Math.random() * 1000

    const uniforms = {}
    uniforms.tex = { type: "t", value: lineTex }
    uniforms.texIrr1 = { type: "t", value: TEXIRR1 }
    uniforms.texIrr2 = { type: "t", value: TEXIRR2 }
    uniforms.color = { type: "c", value: new THREE.Color() }
    uniforms.colorOpp = { type: "c", value: new THREE.Color() }
    uniforms.alpha = { type: "f", value: Math.min( alpha * 2, 1. ) }
    uniforms.stepX = { type: "f", value: 1 / config.steps }
    uniforms.percentY = { type: "f", value: pY }
    uniforms.texSize = { type: "f", value: Math.random() * 4 + .5 }
    uniforms.tDisp = { type: "t", value: tex }
    uniforms.strx = { type: "f", value: configDisp.strx * alpha }
    uniforms.stry = { type: "f", value: configDisp.stry * alpha }
    uniforms.time = { type: "f", value: time }
    uniforms.uID = { type: "f", value: Math.random() * 9999 }
    uniforms.luminosityStrength = { type: "f", value: config.luminosityStrength }

    const mat = new MeshLineMaterial( { lineWidth: config.size, uniforms: uniforms, fragmentShader: fs, vertexShader: vs })
    mat.transparent = true
    mat.depthWrite = false
    mat.blending = THREE.OneMinusSrcAlphaFactor

    super( geo, mat )

    this.configDisp = configDisp
    this.alpha = alpha

    this.geo = geo
    this.mat = mat

    this.time = time
    this.config = config

    this.uniqueSpeed = 0

    this.setAdditive( config.additive )
  }

  setColor( hue, diffCol ) {
    this.diffCol = 1 - diffCol
    this.setHUE( hue )
  }

  setColorB( a, b, idxBright ) {
    const c1 = new THREE.Color( a )
    let hsl = c1.getHSL()
    hsl.h += Math.random() * .05 - .025
    if( idxBright == 0 ) {
      hsl.l -= .15
      this.uniqueSpeed = 0
    } else if ( idxBright == 2 ) {
      hsl.l += .15
      this.uniqueSpeed += this.config.timeSpeed * Math.random() * 2
    } else {
      this.uniqueSpeed += this.config.timeSpeed * Math.random() * 1
    }
    c1.setHSL( hsl.h, hsl.s, hsl.l )
    this.mat.uniforms.color.value = c1

    const c2 = new THREE.Color( b )
    hsl = c2.getHSL()
    hsl.h += Math.random() * .05 - .025
    if( idxBright == 0 ) {
      hsl.l -= .1
    } else if ( idxBright == 2 ) {
      hsl.l += .1
    }
    c2.setHSL( hsl.h, hsl.s, hsl.l )
    this.mat.uniforms.colorOpp.value = c2
  }

  setHUE( hue ) {
    const h = ( hue + 20 * this.diffCol ) % 360
    const l = 50 - 20 * this.diffCol >> 0
    this.mat.uniforms.color.value.set( "hsl( " + ( h ) + ", 100%, " + l + "% )" )
    this.mat.uniforms.colorOpp.value.set( "hsl( " + ( ( h + 30 ) % 360 ) + ", 100%, " + l + "% )" )
  }

  setAdditive( value ) {
    this.mat.blending = value ? THREE.AdditiveBlending : 1
  }

  refreshDisp() {
    this.mat.uniforms.strx.value = this.configDisp.strx * this.alpha
    this.mat.uniforms.stry.value = this.configDisp.stry * this.alpha
  }

  update() {
    this.time += ( this.config.timeSpeed + this.uniqueSpeed )  * .15
    this.mat.uniforms.time.value = this.time
    this.mat.uniforms.luminosityStrength.value = this.config.luminosityStrength
  }

}

module.exports = Line
module.exports.TEXS = TEXS
