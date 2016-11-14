const stage3d = require( "mnf/core/stage3d" )
const OrbitControl = require( "mnf/3d/OrbitControl" )
const gui = require( "mnf/utils/gui" )
const keyboard = require( "mnf/utils/keyboard" )

const Nuancier = require( "chanel/nuancier/Nuancier" )

class Main {

	constructor() {
		stage3d.control = new OrbitControl( stage3d.camera, null, 23 )
		stage3d.control._phi = Math.PI * .5
		// stage3d.control._theta = Math.PI
		// stage3d.control.deactivate()

		stage3d.camera.fov = 51
		stage3d.camera.updateProjectionMatrix()

		this.nuancier = new Nuancier()

		document.querySelector( ".main" ).appendChild(stage3d.renderer.domElement)
	}

}

module.exports = Main
