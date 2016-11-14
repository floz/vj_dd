const stage3d = require( "mnf/core/stage3d" )
const OrbitControl = require( "mnf/3d/OrbitControl" )
const gui = require( "mnf/utils/gui" )
const keyboard = require( "mnf/utils/keyboard" )

const Lines = require( "sg/Lines" )

class Main {

	constructor() {
		stage3d.control = new OrbitControl( stage3d.camera, null, 23 )
		// stage3d.control._phi = 1.0632680894366155
		stage3d.control._phi = Math.PI
		stage3d.control._theta = Math.PI
		// stage3d.control._theta = 2.5930630508294277
		stage3d.control.deactivate()

		stage3d.camera.fov = 51
		stage3d.camera.updateProjectionMatrix()

		const cameraPos = {
			pos0: () => {
				stage3d.control.__phi = 1.0632680894366155
				stage3d.control.__theta = 2.5930630508294277
				stage3d.control.__radius = 40
				stage3d.camera.fov = 51
				stage3d.camera.updateProjectionMatrix()
			},
			pos1: () => {
				stage3d.control.__phi = 1.1903180894366152
				stage3d.control.__theta = 2.4720630508294157
				stage3d.control.__radius = 48.84222034910039
				stage3d.camera.fov = 44
				stage3d.camera.updateProjectionMatrix()
			}
		}
		// stage3d.control.deactivate()

		const fCamera = gui.addFolder( "Camera" )
		fCamera.add( stage3d.camera, "fov", 10, 120, 1 ).listen().onChange( () => {
			stage3d.camera.updateProjectionMatrix()
		} )
		fCamera.add( cameraPos, "pos0" )
		fCamera.add( cameraPos, "pos1" )
		fCamera.open()

		const lines = new Lines( this.configLines )
		stage3d.add( lines )

		document.querySelector( ".main" ).appendChild(stage3d.renderer.domElement)

		keyboard.down.add( this.onKeyboard )
	}

	onKeyboard = () => {
		stage3d.control.traceDebug()
	}

}

module.exports = Main
