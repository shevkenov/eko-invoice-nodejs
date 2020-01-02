const {authCookieName} = require('../config/cookie');
const userModel = require('../model/User');
const jwt = require('../utils/jwt');

module.exports = {
    authentication: async(req,res,next) => {
        try {
            const token = req.cookies[authCookieName] || '';
            const {id} = await jwt.verifyToken(token);
            const user = await userModel.findById(id).then(user => user);
            if(user){
                res.locals.user = user;
            }
            
        } catch (error) {
            const msg = ["jwt expired", "jwt must be provided", "jwt malformed"];
            if (msg.includes(error.message)) {
              res.render("login.hbs");
              return;
            }
            throw new Error(error); 
        }
        
        next();
    }
}