const PatternGenerator = require( "./PatternGenerator" )

class Pattern extends THREE.Group {

  constructor( x, y, w, h ) {
    super()

    this.generator = new PatternGenerator( this, x, y, w, h, 1 )
  }

}

module.exports = Pattern
