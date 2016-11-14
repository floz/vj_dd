const Line = require( "./Line" )

class Set extends THREE.Group {

  constructor( config, color, geo, sim, startY ) {
    super()

    this.config = config
    this.color = color
    this.geo = geo

    const w = this.config.line.steps * this.config.line.space

    this.lines = []

    let x = 0
    let brightness = 0
    let idxBright = 0
    const n = 3
    const m = 3
    for( let j = 0; j < m; j++ ) {
      let y = startY
      brightness = j / m
      for( let i = 0; i < n; i++ ) {
        let line = new Line( this.geo, this.config.line, 1, .5, sim.rt.texture, this.config.disp )
        line.position.x = x
        line.position.y = y
        line.setLineSpeedEffect( ( n - i - 1 ) / ( n - 1 ) )
        line.setColorB( color.a, color.b, idxBright )
        line.setLineBrightness( brightness )
        this.add( line )

        this.lines.push( line )

        y += 1
      }
      idxBright++
      x += w + 1.5
    }
  }

  update() {
    for( let i = 0, n = this.lines.length; i < n; i++ ) {
      this.lines[ i ].update()
    }
  }

}

module.exports = Set
