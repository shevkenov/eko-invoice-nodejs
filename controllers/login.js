const userModel = require('../model/User');
const { authCookieName } = require("../config/cookie");
const jwt = require('../utils/jwt');

module.exports = {
    getLogin: (req,res) => {
        res.render('login.hbs')
    },
    postLogin: (req,res,next) => {
        const {username,password} = req.body;

        userModel
          .findOne({ username })
          .then(user => Promise.all([user, user.matchPassword(password)]))
          .then(([user, match]) => {
            if(!match){
                res.render("login.hbs", {
                  error: "Invalid username or password!"
                });
                return;
            }
            const token = jwt.createToken({id: user.id});
            res.cookie(authCookieName, token).redirect('/');
            //res.render("home.hbs");
          })
          .catch(err => {
            console.log(err);
            res.render("login.hbs", {
              error: "Invalid username or password!"
            });
            return;
          });
    }
}