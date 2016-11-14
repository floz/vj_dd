const stage = require( "mnf/core/stage" )
const stage3d = require( "mnf/core/stage3d" )
const convertSpace = require( "mnf/3d/convertSpace" )
const MeshLineGeometry = require( "mnf/3d/lines/MeshLineGeometry" )

const dataColors = require( "./colors" )
const SimpleLineDisplacementSimulation = require( "./SimpleLineDisplacementSimulation" )
const Set = require( "./Set" )

class Nuancier {

  constructor() {
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
        steps: 150,
        space: .05,
        timeSpeed: .051,
        additive: false,
        // luminosityStrength: .5
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

    const rMod = 0
    this.sim = new SimpleLineDisplacementSimulation( this.config.line.steps, this.config.lines.count, rMod )

    this.pGeo =  []
    const w = this.config.line.steps * this.config.line.space
    let p = -( w ) * .5
    for( let i = 0; i < this.config.line.steps; i++ ) {
      this.pGeo.push( p, 0, 0 )
      p += this.config.line.space
    }
    this.geo = new MeshLineGeometry( this.pGeo )

    this.sets = []

    const colors = dataColors.getColors()
    let y = -colors.length * 4 * .5 + 1
    for( let i = 0, n = colors.length; i < n; i++ ) {
      let set = new Set( this.config, colors[ i ], this.geo, this.sim, y )
      set.position.x = -w - 1.5
      console.log( convertSpace.worldToScreen( new THREE.Vector3( set.position.x, y, 0.00001 ) ) )
      stage3d.add( set )

      this.sets.push( set )

      y += 4
    }

    stage.onUpdate.add( this.onUpdate )
  }

  onUpdate = () => {
    this.refreshSim()
    for( let i = 0, n = this.sets.length; i < n; i++ ) {
      this.sets[ i ].update()
    }
  }

  refreshSim() {
    this.sim.update( this.config.disp.scaleX, this.config.disp.scaleY, this.config.disp.perx, this.config.disp.pery, this.config.disp.rot, this.config.disp.timeFriction )
  }

}

module.exports = Nuancier
