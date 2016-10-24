const stage3d = require( "mnf/core/stage3d" )
const gui = require( "mnf/utils/gui" )

const PostProcessPass = require( "dd/postprocess/PostProcessPass" )
const Pattern = require( "dd/patterns/Pattern" )
const Floor = require( "dd/scene/Floor" )


class DD {

  constructor() {
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
    o.spotLightColor = 0xeb5314

    const ambient = new THREE.AmbientLight( o.ambientColor )
    stage3d.add( ambient )

    const spotLight = new THREE.SpotLight( o.spotLightColor )
    spotLight.name = 'MainLight'
    // spotLight.angle = 2.6 //
    spotLight.angle =  1.72
    spotLight.intensity = 0.2
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
    fLight.add( spotLight, "distance", 0, 3000 )
    fLight.add( spotLight.position, "y", 0, 1000 )
    fLight.add( spotLight.position, "z", 0, 1000 )
    fLight.addColor( o, "ambientColor" ).onChange( () => {
      ambient.color = new THREE.Color( o.ambientColor )
    })
    fLight.addColor( o, "spotLightColor" ).onChange( () => {
      spotLight.color = new THREE.Color( o.spotLightColor )
    })

    // elements

    const container = new THREE.Group()
    container.position.x = 34
    container.rotation.set( .001, .001, 0.6697 )
    stage3d.add( container )

    const pattern = new Pattern( 0, 0, 200, 200 )
    pattern.position.y = 75
    pattern.position.z = -40
    container.add( pattern )

    const floor = new Floor()
    floor.position.z = -140
    container.add( floor )

    const fFloor = gui.addFolder( "Floor" )
    fFloor.add( floor.position, "z", -1000, 0 )
    fFloor.open()

    const fContainer = gui.addFolder( "Container" )
    fContainer.add( container.position, "x", -200, 200 )
    fContainer.add( container.position, "y", -200, 200 )
    fContainer.add( container.position, "z", -200, 200 )
    fContainer.add( container.rotation, "x", -Math.PI, Math.PI )
    fContainer.add( container.rotation, "y", -Math.PI, Math.PI )
    fContainer.add( container.rotation, "z", -Math.PI, Math.PI )
    fContainer.open()
  }

}

module.exports = DD
