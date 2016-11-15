const gui = require( "mnf/utils/gui" )

const black = {
  a: new THREE.Color( 0x000000 ),
  b: new THREE.Color( 0x2b2828 ),
  s: "NOIRE",
  speedFactor: 0.0035,
  brightnessFactor: .15,
  flickeringFactor: 0.,
  texRepeatDetails: 2.,
  texRepeatBrightness: 5.,
}
const red = {
  a: new THREE.Color( 0x9c0006 ),
  b: new THREE.Color( 0xfc0003 ),
  s: "ROUGE",
  speedFactor: 0.0035,
  brightnessFactor: .25,
  flickeringFactor: .01,
  texRepeatDetails: 2.,
  texRepeatBrightness: 5.,
}
const gold = {
  a: new THREE.Color( 0xb37a33 ),
  b: new THREE.Color( 0xf4ecbe ),
  s: "OR",
  speedFactor: 0.0035,
  brightnessFactor: 1.,
  flickeringFactor: .14,
  texRepeatDetails: 2.,
  texRepeatBrightness: 5.,
}
const goldLight = {
  a: new THREE.Color( 0x83764a ),
  b: new THREE.Color( 0xe8dcb7 ),
  s: "OR CLAIR",
  speedFactor: 0.0035,
  brightnessFactor: .9,
  flickeringFactor: .075,
  texRepeatDetails: 3.1,
  texRepeatBrightness: 2.2,
}
const silver = {
  a: new THREE.Color( 0xd1d1d3 ),
  b: new THREE.Color( 0x7f7a80 ),
  s: "ARGENT",
  speedFactor: 0.0035,
  brightnessFactor: .75,
  flickeringFactor: .05,
  texRepeatDetails: 2.,
  texRepeatBrightness: 5.,
}

const fBlack = gui.addFolder( "Black" )
fBlack.add( black, "speedFactor", 0, 0.02, 0.0001 )
fBlack.add( black, "brightnessFactor", 0, 1, 0.01 )
fBlack.add( black, "flickeringFactor", 0, .5, 0.01 )
fBlack.add( black, "texRepeatDetails", 1, 20, .1 )
fBlack.add( black, "texRepeatBrightness", 1, 20, .1 )
// fBlack.open()

const fRed = gui.addFolder( "Red" )
fRed.add( red, "speedFactor", 0, 0.02, 0.0001 )
fRed.add( red, "brightnessFactor", 0, 1, 0.01 )
fRed.add( red, "flickeringFactor", 0, .5, 0.01 )
fRed.add( red, "texRepeatDetails", 1, 20, .1 )
fRed.add( red, "texRepeatBrightness", 1, 20, .1 )
// fRed.open()

const fGold = gui.addFolder( "Gold" )
fGold.add( gold, "speedFactor", 0, 0.02, 0.0001 )
fGold.add( gold, "brightnessFactor", 0, 1, 0.01 )
fGold.add( gold, "flickeringFactor", 0, .5, 0.01 )
fGold.add( gold, "texRepeatDetails", 1, 20, .1 )
fGold.add( gold, "texRepeatBrightness", 1, 20, .1 )
// fGold.open()

const fGoldLight = gui.addFolder( "GoldLight" )
fGoldLight.add( goldLight, "speedFactor", 0, 0.2, 0.0001 )
fGoldLight.add( goldLight, "brightnessFactor", 0, 1, 0.01 )
fGoldLight.add( goldLight, "flickeringFactor", 0, .5, 0.01 )
fGoldLight.add( goldLight, "texRepeatDetails", 1, 20, .1 )
fGoldLight.add( goldLight, "texRepeatBrightness", 1, 20, .1 )
// fGoldLight.open()

const fSilver = gui.addFolder( "Silver" )
fSilver.add( silver, "speedFactor", 0, 0.2, 0.0001 )
fSilver.add( silver, "brightnessFactor", 0, 1, 0.01 )
fSilver.add( silver, "flickeringFactor", 0, .5, 0.01 )
fSilver.add( silver, "texRepeatDetails", 1, 20, .1 )
fSilver.add( silver, "texRepeatBrightness", 1, 20, .1 )
// fSilver.open()

const colors = [ silver, goldLight, gold, red, black ]

module.exports.getColors = () => { return colors }
module.exports.getBlack = () => { return black }
module.exports.getRed = () => { return red }
module.exports.getGold = () => { return gold }
module.exports.getGoldLight = () => { return goldLight }
module.exports.getSilver = () => { return silver }
