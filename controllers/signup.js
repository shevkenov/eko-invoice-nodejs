const bcrypt = require('bcryptjs');
const userModel = require('../model/User');


module.exports = {
    getSignup: (req, res) => {
        res.render('signup.hbs');
    },
    postSignup: (req, res, next) => {
        let {username, password} = req.body;

        userModel.create({ username, password })
          .then(user => {
              res.render('home.hbs', {user});
          })
          .catch(err => {
              if (err.name === "ValidationError") {
                const error = 'Sorry, you did not pass the requirements!';
                res.render("signup.hbs", { error });
                return;
              }

              if (err.name === "MongoError" && err.code === 11000) {
                const error = "User is already registered!";
                res.render("signup.hbs", { error });
                return;
              }

              next(err);
          });
    }
}