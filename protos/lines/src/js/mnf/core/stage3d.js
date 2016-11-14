//
// Wrapper for requestAnimationFrame, Resize & Update
// this.author : David Ronai / this.Makio64 / makiopolis.com
//

const Signals = require("mnf/events/Signals")
const stage = require("mnf/core/stage")

//------------------------
class Stage3d{

	constructor(){
		this.camera 	= null
		this.scene 		= null
		this.renderer 	= null
		this.usePostProcessing 		= false
		this.passes 				= []
		this.isActivated 			= false
		this.clearAuto				= true
		this.clearAlpha				= 1

		this.onBeforeRenderer = new Signals()

		let w = stage.width
		let h = stage.height

		this.camera = new THREE.PerspectiveCamera( 50, w / h, 1, 1000000 )
		this.scene = new THREE.Scene()
		// this.scene.background = new THREE.Color( 0xffffff );

		// orthographic scene for buffer
		this.scene2 = new THREE.Scene()
		this.orthoCamera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0, 1 )
		this.mesh =  new THREE.Mesh( new THREE.PlaneBufferGeometry( 1, 1 ), new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:this.clearAlpha}) )
		this.scene2.add( this.mesh )

		const attributes = { alpha:true, antialias:true, preserveDrawingBuffer:true, backgroundColor: 0xffffff }

		// yolo
		this.renderer = new THREE.WebGLRenderer( attributes )
		this.renderer.setPixelRatio( location.href.indexOf( "#hd" ) > -1 ? 2 : 1 )
		// this.renderer.setPixelRatio( stage.resolution )
		this.renderer.domElement.className = 'three'
		this.renderer.setSize( w, h )
		this.renderer.setClearColor( 0, this.clearAlpha )

		stage.onUpdate.add(this.render)
		stage.onResize.add(this.resize)
		
	}

	initPostProcessing = ()=>{
		this.composer = new WAGNER.Composer( this.renderer, {useRGBA: true} )
		this.composer.setSize( this.renderer.domElement.width, this.renderer.domElement.height )
	}

	add = (obj)=>{
		this.scene.add(obj)
	}

	remove = (obj)=>{
		this.scene.remove(obj)
	}

	getObjectByName = ( name )=>{
		return this.scene.getObjectByName( name )
	}

	addPass = (pass)=>{
		this.passes.push(pass)
	}

	render = (dt)=> {
		this.renderer.autoClearColor = this.clearAuto
		this.renderer.autoClear = this.clearAuto
		this.mesh.material.opacity = this.clearAlpha

		if(this.control){
			this.control.update(dt)
		}

		this.onBeforeRenderer.dispatch()

		if(this.usePostProcessing){
			// this.composer.reset()
			// this.composer.render( this.scene2, this.orthoCamera )
			// this.composer.toScreen()
			this.composer.reset()
			this.composer.render( this.scene, this.camera )
			for( let i = 0, n = this.passes.length; i < n; i++ ) {
				let pass = this.passes[ i ]
				this.composer.pass( pass )
			}
			this.composer.toScreen()
		}
		else{
			this.renderer.render(this.scene, this.camera)
		}
	}

	setBackgroundColor( color ) {
		this.scene.background = new THREE.Color( color );
	}

	resize = ()=>{
		this.camera.aspect = stage.width / stage.height
		this.camera.updateProjectionMatrix()
		this.renderer.setSize( stage.width, stage.height )
		this.renderer.setPixelRatio( stage.resolution )
		this.render(0)
		if(this.composer){
			this.composer.setSize( this.renderer.domElement.width, this.renderer.domElement.height )
		}
	}
}

module.exports = new Stage3d()
