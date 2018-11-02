const { ObjectID } = require('mongodb')
const jwb = require('jsonwebtoken')

var { Model } = require('../../model')
var { User } = require('../../user')

var todos = [
  {
    _id: new ObjectID(),
    text: ' what the fuck u want'
  },
  {
    _id: new ObjectID(),
    text: 'ni main ne ni jana yar'
  }
]
var objectid1 = new ObjectID()
var objectid2 = new ObjectID()

var userdata = [
  {
    _id: objectid1,
    email: 'alibhai@gmail.com',
    password: 'mynameiskhan',
    tokens: [
      {
        access: 'auth',
        token: jwb
          .sign({ _id: objectid1, access: 'auth' }, 'sohaibi')
          .toString()
      }
    ]
  },
  {
    _id: objectid2,
    email: 'mylove123@gmail.com',
    password: 'alibhaiwow9'
  }
]

const populateTodos = done => {
  Model.deleteMany({})
    .then(() => {
      Model.insertMany(todos)
    })
    .then(() => {
      done()
    })
}

const populateUsers = function (done) {
  this.timeout(10000)
  User.deleteMany({})
    .then(() => {
      var user1 = new User(userdata[0]).save()
      var user2 = new User(userdata[1]).save()
      return Promise.all([user1, user2])
    })
    .then(() => {
      done()
    })
}

module.exports = {
  todos,
  populateTodos,
  userdata,
  populateUsers
}
