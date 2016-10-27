const stage3d = require( "mnf/core/stage3d" )
const gui = require( "mnf/utils/gui" )

const colors = require( "dd/core/colors" )
const PostProcessPass = require( "dd/postprocess/PostProcessPass" )
const Pattern = require( "dd/patterns/Pattern" )
const styleFactory = require( "dd/patterns/styles/styleFactory" )
const Floor = require( "dd/scene/Floor" )

const timeout = require( "mnf/utils/timeout" )

class DD {

  constructor( fCamera ) {
    // post processing

    stage3d.initPostProcessing()

    // const bloomPass = new WAGNER.MultiPassBloomPass(512,512)
    // bloomPass.params.applyZoomBlur = false;
    // bloomPass.params.blurAmount = .9;
    // stage3d.addPass(bloomPass)
    // const bloomgui = gui.addFolder('bloom')
    // bloomgui.add(bloomPass.blendPass.params,'opacity', 0, 1)
    // bloomgui.add(bloomPass.blendPass.params,'mode', 0, 23, 1)
    // bloomgui.add(bloomPass.params,'applyZoomBlur')
    // bloomgui.add(bloomPass.params,'zoomBlurStrength',0,1)
    // bloomgui.add(bloomPass.params,'blurAmount',0,1)
    // const bloomPass2 = new WAGNER.MultiPassBloomPass(256,256)
    // bloomPass2.params.applyZoomBlur = true;
    // bloomPass2.params.zoomBlurStrength = .1;
    // bloomPass2.params.blurAmount = 1;
    // stage3d.addPass(bloomPass2)
    // const bloom2gui = gui.addFolder('bloom2')
    // bloom2gui.add(bloomPass2.blendPass.params,'opacity', 0, 1)
    // bloom2gui.add(bloomPass2.blendPass.params,'mode', 0, 23, 1)
    // bloom2gui.add(bloomPass2.params,'applyZoomBlur')
    // bloom2gui.add(bloomPass2.params,'zoomBlurStrength',0,1)
    // bloom2gui.add(bloomPass2.params,'blurAmount',0,1)
    // stage3d.addPass(new WAGNER.FXAAPass())

		stage3d.addPass( this.postProcess = new PostProcessPass() )

    this.sceneHUE = 216
    colors.set( this.sceneHUE )
    const fGlobal = gui.addFolder( "Global" )
    fGlobal.add( this, "sceneHUE", 0, 360 ).onChange( this.updateSceneColor )

    stage3d.scene.fog.color = colors.getFog()
    stage3d.renderer.setClearColor( colors.getFog() )


    // lights

    const o = {}
    // o.ambientColor = 0x2d415f
    // o.spotLightColor = 0x0f1625
    o.containerOrientation1 = () => {
      this.container.position.set( 0, 0, 0 )
      this.container.rotation.set( .001, .001, 0.001 )
    }
    o.containerOrientation2 = () => {
      this.container.position.x = 34
      this.container.rotation.set( .001, .001, 0.6697 )
    }
    o.containerOrientation3 = () => {
      this.container.position.x = 34
      this.container.rotation.set( .001, .001, 0.001 )
    }

    fCamera.add( o, "containerOrientation1" )
    fCamera.add( o, "containerOrientation2" )

    const ambient = new THREE.AmbientLight( colors.getAmbient() )
    stage3d.add( ambient )
    this.ambient = ambient

    const spotLight = new THREE.SpotLight( colors.getSpotLight() )
    spotLight.name = 'MainLight'
    // spotLight.angle = 2.6 //
    spotLight.angle =  .9
    spotLight.intensity = 0.45
    spotLight.penumbra = 0.45
    spotLight.position.set( 0, 66, 320 )
    spotLight.lookAt( new THREE.Vector3() )
    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.bias = -0.01
    spotLight.shadow.darkness = 0.1
    stage3d.add( spotLight )
    this.spotLight = spotLight

    const fLight = gui.addFolder( "SpotLight" )
    fLight.add( spotLight, "angle", 0, Math.PI * 2 )
    fLight.add( spotLight, "penumbra", 0, 2 )
    fLight.add( spotLight, "intensity", 0, 1 )
    fLight.add( spotLight, "decay", 0, 2000 )
    fLight.add( spotLight.shadow.camera, "near", 0, 100 )
    fLight.add( spotLight.shadow.camera, "far", 0, 4000 )
    fLight.add( spotLight, "distance", 0, 300 )
    fLight.add( spotLight.position, "y", 0, 1000 )
    fLight.add( spotLight.position, "z", 0, 1000 )

    // elements

    this.container = new THREE.Group()
    this.container.rotation.set( .001, .001, 0.001 )
    stage3d.add( this.container )

    styleFactory.setDivideDefinition( 2, 2 )

    this.containerPatterns = new THREE.Group()
    this.container.add( this.containerPatterns )

    this.patternSerieCnt = new THREE.Group()

    // this.createTower()
    // this.createFive()
    // this.createElevation()
    // this.createTunnel()
    // this.createCentered()

    this.patternsPool = []
    for( let i = 0, n = 6; i < n; i++ ) {
      let pattern = new Pattern( 0, 0, 400, 400 )
      this.patternsPool.push( pattern )
    }

    timeout( () => {
      this.createSerie()
    }, 200 )

    this.floor = new Floor()
    this.floor.position.z = -140
    this.container.add( this.floor )

    const fFloor = gui.addFolder( "Floor" )
    fFloor.add( this.floor.position, "z", -1000, 0 )
    // fFloor.open()

    const fContainer = gui.addFolder( "Container" )
    fContainer.add( this.container.position, "x", -200, 200 )
    fContainer.add( this.container.position, "y", -200, 200 )
    fContainer.add( this.container.position, "z", -200, 200 )
    fContainer.add( this.container.rotation, "x", -Math.PI, Math.PI )
    fContainer.add( this.container.rotation, "y", -Math.PI, Math.PI )
    fContainer.add( this.container.rotation, "z", -Math.PI, Math.PI )
    // fContainer.open()

    const fContainerPatterns = gui.addFolder( "ContainerPatterns" )
    fContainerPatterns.add( this.containerPatterns.position, "x", -200, 200 )
    fContainerPatterns.add( this.containerPatterns.position, "y", -200, 200 )
    fContainerPatterns.add( this.containerPatterns.position, "z", -200, 200 )
    fContainerPatterns.add( this.containerPatterns.rotation, "x", -Math.PI, Math.PI )
    fContainerPatterns.add( this.containerPatterns.rotation, "y", -Math.PI, Math.PI )
    fContainerPatterns.add( this.containerPatterns.rotation, "z", -Math.PI, Math.PI )
    // fContainerPatterns.open()
  }

  updateSceneColor = () => {
    colors.set( this.sceneHUE >> 0 )

    stage3d.scene.fog.color = colors.getFog()
    stage3d.renderer.setClearColor( stage3d.scene.fog.color )

    this.tweenColorTo( this.ambient.color, colors.getAmbient() )
    this.tweenColorTo( this.spotLight.color, colors.getSpotLight() )

    // this.pattern.refreshColors()
    for( let i = 0, n = this.patterns.length; i < n; i++ ) {
      this.patterns[ i ].refreshColors()
    }

    // this.floor.setColor( colors.getFloor() )
  }

  tweenColorTo( base, to ) {
    const hslTo = to.getHSL()
    const hslCurr = base.getHSL()

    base.setHSL( hslTo.h, hslTo.s, hslTo.l )
    //
    // TweenLite.to( hslCurr, .6, {
    //   h: hslTo.h,
    //   s: hslTo.s,
    //   l: hslTo.l,
    //   ease: Quad.easeOut,
    //   onUpdate: () => {
    //     base.setHSL( hslCurr.h, hslCurr.s, hslCurr.l )
    //   }
    // } )
  }

  createTower() {
    let pz = 0
    let size = 800
    let towerLength = 4
    let diffSize = 400
    let sizeStep = diffSize / towerLength
    for( let i = 0, n = towerLength; i < n; i++ ) {
      let pattern = new Pattern( 0, 0, size, size, 4 )
      pattern.position.y = 75
      pattern.position.z = 100 + pz
      this.containerPatterns.add( pattern )
      if( i > 1 ) {
        pattern.disableShadows()
      }

      pz += 100
      size -= sizeStep
    }
  }

  createFive() {
    const size = 200
    const pos = [
      [ 0, 0 ],
      [ -size, -size ],
      [ size, -size ],
      [ -size, size ],
      [ size, size ]
    ]

    for( let i = 0, n = pos.length; i < n; i++ ) {
      let posCurr = pos[ i ]

      let pattern = new Pattern( 0, 0, size, size )
      pattern.position.x = posCurr[ 0 ]
      pattern.position.y = posCurr[ 1 ]
      pattern.position.z = -50
      pattern.disableShadows()
      this.containerPatterns.add( pattern )
    }
  }

  createElevation() {
    const data = [
      [ -300, 150, -50, 800 ],
      [ -200, -200, 50, 400 ],
      [ 200, 200, 50, 400 ],
      [ 400, -200, 100, 100 ],
      [ -400, 700, 100, 300 ],
      [ -200, 200, 150, 200 ]
    ]

    for( let i = 0, n = data.length; i < n; i++ ) {
      let dataCurr = data[ i ]

      let pattern = new Pattern( 0, 0, dataCurr[ 3 ], dataCurr[ 3 ] )
      pattern.position.x = dataCurr[ 0 ]
      pattern.position.y = dataCurr[ 1 ]
      pattern.position.z = dataCurr[ 2 ]
      if( i > 1 ) {
        pattern.disableShadows()
      }
      this.containerPatterns.add( pattern )
    }
  }

  createTunnel() {
    const data = [
      [ 0, 0, -50, 400 ],
      [ -200, -200, 400, 200 ],
      [ 200, 200, 400, 200 ],
      [ -400, 200, 2000, 400 ],
      [ 0, 0, 5000, 800 ],
    ]

    for( let i = 0, n = data.length; i < n; i++ ) {
      let dataCurr = data[ i ]

      let pattern = new Pattern( 0, 0, dataCurr[ 3 ], dataCurr[ 3 ] )
      pattern.position.x = dataCurr[ 0 ]
      pattern.position.y = dataCurr[ 1 ]
      pattern.position.z = dataCurr[ 2 ]
      pattern.disableShadows()
      this.containerPatterns.add( pattern )
    }
  }

  createCentered() {
    let pattern = new Pattern( 0, 0, 400, 400 )
    pattern.position.z = -50
    // pattern.disableShadows()
    this.containerPatterns.add( pattern )
    pattern.show()
    this.pattern = pattern
  }

  createSerie() {
    this.patterns = []
    this.patternsSeriesData = [
      [ 0, 0, -50, 400 ],
      [ -400, 0, -50, 400 ],
      [ 400, 0, -50, 400 ],
      [ 0, 400, -50, 400 ],
    ]

    this.patternSerieCnt.position.x = -this.patternsSeriesData[ 0 ][ 0 ]
    this.containerPatterns.add( this.patternSerieCnt )

    this.createSeriePattern()
    // timeout( this.createSeriePattern, 1500 )
    // timeout( this.createSeriePattern, 2800 )
    // timeout( this.createSeriePattern, 4100 )
    timeout( this.firstSerieCreation, 1750 )
    timeout( this.lastSerieCreation, 3100 )
    timeout( this.serieMoveCamera, 3600 )
    timeout( this.separateSerie, 5000 )
    timeout( this.regenerateAllSerie, 4800 )
    timeout( this.regenerateAllSerie, 6000 )
    timeout( this.dezoomSerie, 6200 )
    timeout( this.rotateSerie, 7200 )
    timeout( this.rotateSerie2, 8200 )
    timeout( this.separateSerie2, 9000 )
    timeout( this.regenerateAllSerie, 9400 )
    timeout( this.switchToSolo, 12000 )
  }

  createSeriePattern = () => {
    let idx = this.patterns.length
    let data = this.patternsSeriesData[ idx ]

    let pattern = this.patternsPool[ 0 ]
    pattern.position.x = data[ 0 ]
    pattern.position.y = data[ 1 ]
    pattern.position.z = data[ 2 ]
    this.patternSerieCnt.add( pattern )
    pattern.show()

    this.patterns.push( pattern )

    let newPosX = -data[ 0 ]
    let newPosY = -data[ 1 ]
    timeout( () => {
      TweenLite.to( this.patternSerieCnt.position, .4, {
        x: newPosX,
        y: newPosY,
        ease: Cubic.easeInOut
      } )
    }, 200 )
  }

  firstSerieCreation = () => {
    stage3d.control.radius = stage3d.control._radius = 1200
    TweenLite.to( stage3d.control, 6, {
      radius: 1700,
      ease: Cubic.easeOut
    } )

    let pattern = this.patternsPool[ 1 ]
    pattern.position.x = -400
    pattern.position.y = 0
    pattern.position.z = -50
    this.patternSerieCnt.add( pattern )
    pattern.show()

    this.patterns.push( pattern )

    timeout( () => {
      let pattern = this.patternsPool[ 2 ]
      pattern.position.x = 400
      pattern.position.y = 0
      pattern.position.z = -50
      this.patternSerieCnt.add( pattern )
      pattern.show()

      this.patterns.push( pattern )
    }, 300 )
  }

  lastSerieCreation = () => {
    let pattern = this.patternsPool[ 3 ]
    pattern.position.x = 0
    pattern.position.y = 400
    pattern.position.z = -50
    this.patternSerieCnt.add( pattern )
    pattern.show()

    this.patterns.push( pattern )

    timeout( () => {
      let pattern = this.patternsPool[ 4 ]
      pattern.position.x = -400
      pattern.position.y = 400
      pattern.position.z = -50
      this.patternSerieCnt.add( pattern )
      pattern.show()

      this.patterns.push( pattern )
    }, 200 )


    timeout( () => {
      let pattern = this.patternsPool[ 5 ]
      pattern.position.x = 400
      pattern.position.y = 400
      pattern.position.z = -50
      this.patternSerieCnt.add( pattern )
      pattern.show()

      this.patterns.push( pattern )
    }, 300 )
  }

  serieMoveCamera = () => {
    this.patternSerieCnt.position.x = 0
    this.patternSerieCnt.position.y = -200
  }

  separateSerie = () => {
    TweenLite.to( this.patterns[ 0 ].position, 1, {
      y: this.patterns[ 0 ].position.y - 20,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 1 ].position, 1, {
      x: this.patterns[ 1 ].position.x - 40,
      y: this.patterns[ 1 ].position.y - 20,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 2 ].position, 1, {
      x: this.patterns[ 2 ].position.x + 40,
      y: this.patterns[ 2 ].position.y - 20,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 3 ].position, 1, {
      y: this.patterns[ 3 ].position.y + 20,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 4 ].position, 1, {
      x: this.patterns[ 4 ].position.x - 40,
      y: this.patterns[ 4 ].position.y + 20,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 5 ].position, 1, {
      x: this.patterns[ 5 ].position.x + 40,
      y: this.patterns[ 5 ].position.y + 20,
      ease: Cubic.easeInOut
    })
  }

  regenerateAllSerie = () => {
    for( let i = 0, n = this.patterns.length; i < n; i++ ) {
      let pattern = this.patterns[ i ]
      pattern.regenerate()
    }
  }

  dezoomSerie = () => {
    TweenLite.killTweensOf( stage3d.control )
    stage3d.control.radius = stage3d.control._radius = 1870
    TweenLite.to( stage3d.control, 1.2, {
      radius: 2000,
      ease: Quad.easeOut
    } )
  }

  rotateSerie = () => {
    this.containerPatterns.rotation.z = Math.PI * .5 * .6
    TweenLite.to( this.containerPatterns.rotation, .8, {
      z: Math.PI * .5,
      ease: Cubic.easeInOut
    } )

    for( let i = 0, n = this.patterns.length; i < n; i++ ) {
      this.patterns[ i ].flip2( .15 + Math.random() * .4 )
    }
  }

  rotateSerie2 = () => {
    this.regenerateAllSerie()

    this.containerPatterns.rotation.z = Math.PI * .7
    TweenLite.to( this.containerPatterns.rotation, .8, {
      z: Math.PI,
      ease: Cubic.easeInOut
    } )

    for( let i = 0, n = this.patterns.length; i < n; i++ ) {
      this.patterns[ i ].flip2( .15 + Math.random() * .4 )
    }
  }

  separateSerie2 = () => {
    TweenLite.to( this.patterns[ 0 ].position, 1, {
      y: this.patterns[ 0 ].position.y - 60,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 1 ].position, 1, {
      x: this.patterns[ 1 ].position.x - 120,
      y: this.patterns[ 1 ].position.y - 60,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 2 ].position, 1, {
      x: this.patterns[ 2 ].position.x + 120,
      y: this.patterns[ 2 ].position.y - 60,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 3 ].position, 1, {
      y: this.patterns[ 3 ].position.y + 60,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 4 ].position, 1, {
      x: this.patterns[ 4 ].position.x - 120,
      y: this.patterns[ 4 ].position.y + 60,
      ease: Cubic.easeInOut
    })

    TweenLite.to( this.patterns[ 5 ].position, 1, {
      x: this.patterns[ 5 ].position.x + 120,
      y: this.patterns[ 5 ].position.y + 60,
      ease: Cubic.easeInOut
    })
  }

  prepareSwitch() {
    for( let i = 0, n = this.patternsPool.length; i < n; i++ ) {
      let p = this.patternsPool[ i ]
      if( p.parent ) {
        p.parent.remove( p )
      }
    }

    while( this.containerPatterns.children.length ) {
      let c = this.containerPatterns.children.splice( 0, 1 )
      this.containerPatterns.remove( c )
    }

    this.postProcess.params.glitchRatio = 2
    this.postProcess.params.glitchOffsetX = 2 + 5 * Math.random() >> 0
    this.postProcess.params.glitchOffsetY = 2 + 5 * Math.random() >> 0
  }

  switchToSolo = () => {
    this.prepareSwitch()
  }

}

module.exports = DD
