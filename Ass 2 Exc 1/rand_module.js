function rand(x, y) {
    return Math.floor(Math.random() * (y - x)) + x;
}
module.exports = { rand };