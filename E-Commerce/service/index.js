import jwt from 'jsonwebtoken';
const secret_key = 'Sumit@123';

function setuser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role
    }, secret_key);
}
function getuser(token) {
    try {
        return jwt.verify(token, secret_key);
    }
    catch (err) {
        return null;
    }
}

export { setuser, getuser }