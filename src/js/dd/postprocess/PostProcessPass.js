const gui = require( "mnf/utils/gui" )

class PostProcessPass extends WAGNER.Pass {

	constructor() {
		super()

		this.shader = WAGNER.processShader( WAGNER.basicVs, require( "./shaders/postprocess.fs" ) )
		this.mapUniforms( this.shader.uniforms )

		this.params.gamma = .85
		this.params.contrast = 1.15
		this.params.brightness = -.08
		this.params.mirrorX = 0;
		this.params.mirrorY = 0;
		this.params.divide4 = 0;
		this.params.vignetteFallOff = .5;
		this.params.vignetteAmount = .2;
		this.params.invertRatio = 0;
		this.params.amount = .05;
		this.params.speed = 1;
		this.params.time = 0;

		const f = gui.addFolder( "PostProcess" )
		f.add( this.params, "gamma", 0, 10, .1 )
		f.add( this.params, "contrast", 0, 3, .1 )
		f.add( this.params, "brightness", 0, 1, .1 )
		f.open()
	}

	run( c ) {
		this.shader.uniforms.gamma.value = this.params.gamma
		this.shader.uniforms.contrast.value = this.params.contrast
		this.shader.uniforms.brightness.value = this.params.brightness
		this.shader.uniforms.mirrorX.value = this.params.mirrorX
		this.shader.uniforms.mirrorY.value = this.params.mirrorY
		this.shader.uniforms.divide4.value = this.params.divide4
		this.shader.uniforms.vignetteFallOff.value = this.params.vignetteFallOff
		this.shader.uniforms.vignetteAmount.value = this.params.vignetteAmount
		this.shader.uniforms.invertRatio.value = this.params.invertRatio
		this.shader.uniforms.time.value += .000001
		// this.shader.uniforms.mask.value = this.params.mask
		c.pass( this.shader )
	}

}

module.exports = PostProcessPass