const stage3d = require( "mnf/core/stage3d" )
const OrbitControl = require( "mnf/3d/OrbitControl" )
const gui = require( "mnf/utils/gui" )

const DD = require( "dd/DD" )

class Main {

	constructor() {
		stage3d.control = new OrbitControl( stage3d.camera, null, 1000 )
		// stage3d.control.deactivate()
		// stage3d.control._phi = Math.PI * .8
		// stage3d.control._theta = Math.PI * .25

		stage3d.camera.fov = 35
		stage3d.camera.updateProjectionMatrix()

		const o = {}
		o.pos1 = () => {
			stage3d.control._phi = Math.PI * .5
			stage3d.control._theta = Math.PI * .5
		}
		o.pos2 = () => {
			stage3d.control._phi = Math.PI * .8
			stage3d.control._theta = Math.PI * .5
		}
		o.radius1 = () => {
			stage3d.control.radius = stage3d.control._radius = 1000
		}
		o.radius2 = () => {
			stage3d.control.radius = stage3d.control._radius = 2000
		}

		const fCamera = gui.addFolder( "Camera" )
		// fCamera.add( stage3d.camera.position, "x", -100, 100 )
		// fCamera.add( stage3d.camera.position, "y", -100, 100 )
		// fCamera.add( stage3d.camera.position, "z", -100, 100 )
		fCamera.add( stage3d.control, "radius", 0, 10000, 1 ).onChange( () => {
			stage3d.control.__radius = stage3d.control.radius
		})
		fCamera.add( o, "pos1" )
		fCamera.add( o, "pos2" )
		fCamera.add( o, "radius1" )
		fCamera.add( o, "radius2" )
		fCamera.open()

		new DD( fCamera )
	}

}

module.exports = Main
