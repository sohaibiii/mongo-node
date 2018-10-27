const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const userShema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 1,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'email is not valid'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
})
userShema.methods.toJSON = function () {
  // builtd in instance method
  var user = this
  var obj = user.toObject() // convert the instance into object

  return _.pick(obj, ['_id', 'email'])
}

userShema.methods.generateAuthToken = function () {
  // builtd in instance method
  // this shows the instance means single user
  var access = 'auth'
  var token = jwt.sign({ _id: this._id, access }, 'sohaibi')
  this.tokens.push({ access, token })
  return this.save().then(() => {
    return token
  })
}

userShema.statics.findByToken = function (token) {
  var User = this
  var decode
  try {
    decode = jwt.verify(token, 'sohaibi')
  } catch (error) {
    // return new Promise((reject, resolve) => {
    //   reject()
    // })
    return Promise.reject()
  }
  return User.findOne({
    _id: decode._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

userShema.pre('save', function (next) {
  // middleware that runs before saveing and its is for intance
  var user = this
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })
  } else next()
})

// findByToken is a model function
// statics is just like methods object but used for model

var User = mongoose.model('User', userShema)

// userShema is used for adding methods to your model
// userShema.methods is an object where u can add methods
// generateAuthToken is a instance mehtod it apply on all instances every time it creates

module.exports = {
  User
}
