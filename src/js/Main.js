const stage3d = require( "mnf/core/stage3d" )
const OrbitControl = require( "mnf/3d/OrbitControl" )
const gui = require( "mnf/utils/gui" )

const DD = require( "dd/DD" )

class Main {

	constructor() {
		stage3d.control = new OrbitControl( stage3d.camera, null, 1000 )
		stage3d.control._phi = Math.PI * .8
		// stage3d.control._theta = Math.PI * .25

		stage3d.camera.fov = 35
		stage3d.camera.updateProjectionMatrix()

		const fCamera = gui.addFolder( "Camera" )
		fCamera.add( stage3d.camera, "fov", 10, 120, 1 ).listen().onChange( () => {
			stage3d.camera.updateProjectionMatrix()
		} )
		fCamera.open()

		new DD()
	}

}

module.exports = Main
