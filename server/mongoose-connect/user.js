const mongoose = require('mongoose')
var Student = mongoose.model('Student', {
  name: {
    type: String
  },
  isgraduate: {
    type: Boolean
  },
  age: {
    type: Number
  }
})

module.exports = {
  Student
}
