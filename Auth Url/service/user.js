const hash = new Map();

function getuser(id) {
    return hash.get(id)
}

function setuser(id, user) {
    hash.set(id, user);
}

module.exports = { getuser, setuser }