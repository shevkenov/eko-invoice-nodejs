const {authCookieName} = require('../config/cookie');

module.exports = {
    getLogout: (req,res) => {
        res.clearCookie(authCookieName);
        res.redirect('/');
    }
}