const mongoose = require('mongoose')
var Model = mongoose.model('Model', {
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  created: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

module.exports = {
  Model
}
