const stage3d = require( "mnf/core/stage3d" )
const gui = require( "mnf/utils/gui" )

const PostProcessPass = require( "dd/postprocess/PostProcessPass" )
const Pattern = require( "dd/patterns/Pattern" )
const styleFactory = require( "dd/patterns/styles/styleFactory" )
const Floor = require( "dd/scene/Floor" )


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

		stage3d.addPass( new PostProcessPass() )


    // lights

    const o = {}
    o.ambientColor = 0x2d415f
    // o.spotLightColor = 0xeb5314
    o.spotLightColor = 0x0f1625
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

    const ambient = new THREE.AmbientLight( o.ambientColor )
    stage3d.add( ambient )

    const spotLight = new THREE.SpotLight( o.spotLightColor )
    spotLight.name = 'MainLight'
    // spotLight.angle = 2.6 //
    spotLight.angle =  1.72
    spotLight.intensity = 0.7
    spotLight.penumbra = 0.53
    spotLight.position.set( 0, 240, 320 )
    spotLight.lookAt( new THREE.Vector3() )
    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.bias = -0.01
    spotLight.shadow.darkness = 0.1
    stage3d.add( spotLight )

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
    fLight.addColor( o, "ambientColor" ).onChange( () => {
      ambient.color = new THREE.Color( o.ambientColor )
    })
    fLight.addColor( o, "spotLightColor" ).onChange( () => {
      spotLight.color = new THREE.Color( o.spotLightColor )
    })

    // elements

    this.container = new THREE.Group()
    this.container.rotation.set( .001, .001, 0.001 )
    stage3d.add( this.container )

    styleFactory.setDivideDefinition( 2, 2 )

    this.containerPatterns = new THREE.Group()
    this.container.add( this.containerPatterns )

    // this.createTower()
    // this.createFive()
    // this.createElevation()
    // this.createTunnel()
    this.createCentered()

    //
    // const pattern = new Pattern( 0, 0, 200, 200 )
    // pattern.position.y = 75
    // pattern.position.z = 50
    // container.add( pattern )
    //
    // const pattern2 = new Pattern( 0, 0, 400, 400, 2 )
    // pattern2.position.y = 75
    // pattern2.position.z = -50
    // container.add( pattern2 )

    const floor = new Floor()
    floor.position.z = -140
    this.container.add( floor )

    const fFloor = gui.addFolder( "Floor" )
    fFloor.add( floor.position, "z", -1000, 0 )
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
  }

}

module.exports = DD
