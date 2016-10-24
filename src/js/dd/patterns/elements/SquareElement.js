const geometries = require( "dd/core/geometries" )
const colors = require( "dd/core/colors" )
const ElementMaterial = require( "./ElementMaterial" )

class SquareElement extends THREE.Mesh {

  constructor() {
    const mat = new ElementMaterial( {
      color: colors.get()
    } )
    // mat.depthWrite = false

    super( geometries.cube, mat )

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

module.exports = SquareElement
