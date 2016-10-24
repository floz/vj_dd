class BaseStyle {

  constructor( cnt, x, y, w, h, subdivisionFactor, subdivisionCount ) {
    this.cnt = cnt
    this.x = x 
    this.y = y 
    this.w = w 
    this.h = h 
    this.subdivisionFactor = subdivisionFactor
    this.subdivisionCount = subdivisionCount

    this.canSubdivide = false
  }

  subdivide() {
  }

  draw( ctx ) {

  }

  show( delay ) {

  }

}

module.exports = BaseStyle
