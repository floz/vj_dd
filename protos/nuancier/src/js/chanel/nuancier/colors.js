const black = { a: 0x000000, b: 0x2b2828, s: "NOIRE" }
const red = { a: 0xfc0003, b: 0x9c0006, s: "ROUGE" }
const gold = { a: 0xb6931d, b: 0xded971, s: "OR" }
const goldLight = { a: 0x9e9268, b: 0xeae2cb, s: "OR CLAIR" }
const silver = { a: 0x7f7a80, b: 0xd1d1d3, s: "ARGENT" }

const colors = [ silver, goldLight, gold, red, black ]

module.exports.getColors = () => { return colors }
module.exports.getBlack = () => { return black }
module.exports.getRed = () => { return red }
module.exports.getGold = () => { return gold }
module.exports.getGoldLight = () => { return goldLight }
module.exports.getSilver = () => { return silver }
