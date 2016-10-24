const replaceIncludes = require( "mnf/utils/shaders" ).replaceIncludes

const prefixVS  = "precision highp float;\n"

const vs = prefixVS + replaceIncludes( require( "./shaders/ShapeElement.vs" ) )
const vsDepth = replaceIncludes( require( "./shaders/ShapeElementDepth.vs" ) )
const fs = replaceIncludes( require( "./shaders/ShapeElement.fs" ) )

const geometries = require( "dd/core/geometries" )
const colors = require( "dd/core/colors" )
const textures = require( "dd/core/textures" )
const ElementMaterial = require( "./ElementMaterial" )

class TriangleElement extends THREE.Mesh {

  constructor() {
    const mat = new ElementMaterial( {
      color: colors.get(),
      vertexShader: vs,
      vertexShaderDepth: vsDepth,
      fragmentShader: fs,
      transparent: true,
      uniforms: {
        tShape: { type: "t", value: textures.triangle }
      }
    } )
    // mat.depthWrite = false

    super( geometries.plane, mat )

    this.castShadow = true
    this.customDepthMaterial = mat.depthMaterial
  }

  init( x, y, z, w, h, c ) {
    this.position.x = x
    this.position.y = y
    this.position.z = z * 5.5
    this.scale.set( w, h, .1 )
    // this.renderOrder = z
  }

}

module.exports = TriangleElement
