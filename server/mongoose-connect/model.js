const mongoose = require('mongoose')
var Model = mongoose.model('Model', {
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  created:{
    type:Boolean,
    default:false

  },
  createdAt:{
    type:Number,
    default:null
  }
})

module.exports = {
  Model
}
