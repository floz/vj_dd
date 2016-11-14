const random = require( "./core" ).random

const Filin = require( "./Filin" )

const DATA = {
  space: 3
}

class Fibre {

  constructor( divisions, y ) {
    this.divisions = divisions
    // this.countFilins = random() * 2 + 3 >> 0
    this.countFilins = 4

    this.filins = []

    let py = y
    for( let i = 0; i < this.countFilins; i++ ) {
      let filin = new Filin( this.divisions, y + py )
      this.filins.push( filin )

      py += DATA.space
    }
  }

  setup( positions ) {
    for( let i = 0, n = this.filins.length; i < n; i++ ) {
      this.filins[ i ].setup( positions )
    }
  }

}

module.exports = Fibre
