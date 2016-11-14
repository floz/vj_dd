const SimplexNoise = require( "mnf/utils/noise" ).SimplexNoise
const xor = require( "mnf/utils/random" ).xor

let random = xor( "floz" )
let noise = new SimplexNoise( random )

function getRandom() {
  return random
}

function getNoise() {
  return noise
}

module.exports.random = getRandom()
module.exports.noise = getNoise()

module.exports.regenerate = ( key ) => {
  random = xor( key )
  noise = new SimplexNoise( random )
}

module.exports.INDEX_FILIN = 0

const ObjectPool = require( "mnf/utils/ObjectPool" )
module.exports.poolVec3 = new ObjectPool( () => {
  return new THREE.Vector3()
}, 500 )
