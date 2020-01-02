const jwt = require("jsonwebtoken");

const secret = 'invoice-eko';
const expiration = {
    expiresIn: '1h'
};

function createToken(user){
    return jwt.sign(user, secret, expiration);
}

function verifyToken(token){
    return jwt.verify(token, secret);
}

module.exports = {
    createToken,
    verifyToken
}