const MeshLineGPUMaterial = require( "mnf/3d/lines/MeshLineGPUMaterial" )

const core = require( "./core" )

const DATA = {
  space: 10
}

class Filin {

  constructor( divisions, y ) {
    this.divisions = divisions
    this.y = y

    this.index = core.INDEX_FILIN * this.divisions
    this.index4 = this.index * 4

    this.points = []
    for( let i = 0; i < this.divisions; i++ ) {
      this.points.push( core.poolVec3.get() )
    }

    core.INDEX_FILIN++
  }

  setup( positions ) {
    this.positions = positions

    let px = 0
    let idx = 0
    for( let i = 0; i < this.divisions; i++ ) {
      this.positions.image.data[ this.index4 + idx + 0 ] = px
      this.positions.image.data[ this.index4 + idx + 1 ] = this.y

      px += DATA.space
      idx += 4
    }
  }

}

module.exports = Filin
