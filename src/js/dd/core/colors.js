module.exports.get = () => {
  // const hue = ( ( Math.random() * 255 + 170 ) % 360 ) / 360
  let hue = 0
  let sat = 1
  if( Math.random() > .1 ) {
    hue = ( ( 216 + Math.random() * 40 - 20 ) % 360 ) / 360
    sat = .6
  } else {
    hue = ( ( 18 + Math.random() * 40 - 20 ) % 360 ) / 360
    sat = .9
  }
  const lum = .2 + Math.random() * .5
  return new THREE.Color().setHSL( hue, sat, lum )
}
