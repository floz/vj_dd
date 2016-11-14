const stage3d = require( "mnf/core/stage3d" )

const Cloth = require( "./Cloth" )

class Chanel {

  constructor() {
    this.cloth = new Cloth()
    stage3d.add( this.cloth )
  }

}

module.exports = Chanel
