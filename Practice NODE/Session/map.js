const mapper = new Map();
function setuser(id, user) {
    mapper.set(id, user);
}
function getuser(id) {
    return mapper.get(id);
}

module.exports = { setuser, getuser }