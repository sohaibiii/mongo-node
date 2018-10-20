const { ObjectID } = require('mongodb')
const { Model } = require('../server/./mongoose-connect/model')
const { mongoose } = require('../server/./mongoose-connect/connection')
const id = '5bc983674448433224f14d7b'

// Model.find().then(todos => {
//   console.log(todos)
// })

// Model.findOne({
//   _id: '6bc983674448433224f14d7c'
// })
//   .then(todo => {
//     if (!todo) {
//       console.log('product is not in db')
//     } else console.log(todo)
//   })
//   .catch(err => {
//     console.log('my error ', err)
//   })

// Model.findById(id)
//   .then(todo => {
//     if (!todo) {
//       console.log('data is not in db ')
//     } else console.log(todo)
//   })
//   .catch(err => {
//     console.log('my error has occured')
//   })

// removing queries

// Model.remove({}).then(response => {
//   console.log(response)
// })

// Model.findOneAndRemove({ _id: id }).then(todo => {
//   console.log(todo)
// })
// if (!ObjectID.isValid(id)) {
//   console.log('id is not valid')
// }
// Model.findByIdAndRemove(id).then(todo => {
//   if (!todo) {
//     console.log('item not found')
//   } else console.log(todo)
// })
