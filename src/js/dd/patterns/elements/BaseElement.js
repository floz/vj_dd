class BaseElement extends THREE.Mesh {

  constructor( style, geo, mat ) {
    super( geo, mat )
    this.style = style

    this.isShown = false
  }

  setZStep( value ) {
    this.zStep = value
    this.position.z = ( ( this.z - 1 ) ) * this.zStep
  }

  show( zStop = 0 ) {
    if( this.isShown ) {
      return
    }
    this.isShown = true
    TweenLite.to( this.material.uniforms.opacity, .25, {
      value: 1,
      ease: Cubic.easeOut
    } )

    TweenLite.to( this.scale, .6, {
      delay: ( this.z - zStop ) * .3,
      x: this.w,
      y: this.h,
      ease: Math.random() < ( this.z / 8 ) ? Cubic.easeOut : Cubic.easeInOut
    } )
  }

  hide( isInstant = false ) {
    if( isInstant ) {
      this.material.uniforms.opacity.value = 0
      this.scale.x =
      this.scale.y = .001
      this.isShown = false
    }
  }

  regenerate( zStop ) {
    if( this.z >= zStop ) {
      this.style.regenerate()
    }
  }

  disableShadows() {
    this.castShadow = false
    this.customDepthMaterial = null
  }

  clean() {
    this.parent.remove( this )
  }

}

module.exports = BaseElement
