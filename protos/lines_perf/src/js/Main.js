const stage3d = require( "mnf/core/stage3d" )
const OrbitControl = require( "mnf/3d/OrbitControl" )
const gui = require( "mnf/utils/gui" )

const Chanel = require( "chanel/Chanel" )

class Main {

	constructor() {
		stage3d.control = new OrbitControl( stage3d.camera, null, 1000 )
		// stage3d.control.deactivate()
		// stage3d.control._phi = Math.PI * .8
		// stage3d.control._theta = Math.PI * .25

		stage3d.camera.fov = 35
		stage3d.camera.updateProjectionMatrix()

		new Chanel()
	}

}

module.exports = Main
