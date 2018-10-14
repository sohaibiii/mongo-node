const mongoose = require('mongoose')
var Model = mongoose.model('Model', {
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  }
})

module.exports = {
  Model
}
