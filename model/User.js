const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
    unique: [true, "The username already taken"],
    minlength: [4, "Username schould be at least 4 letters"],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    minlength: [4, "Password schould be at least 4 symbols"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true
  }
});

userSchema.methods = {
  matchPassword: function(password) {
    return bcrypt.compare(password, this.password);
  }
}

userSchema.pre("save", function(next) {
  if(this.isModified('password')){
    return bcrypt
      .genSalt()
      .then(salt => {
        return bcrypt.hash(this.password, salt);
      })
      .then(hash => {
        this.password = hash;
        next();
      })
      .catch(err => {
        console.log(err);
        next(err);
        return;
      });
  }
  next();
})

module.exports = mongoose.model('User', userSchema);
