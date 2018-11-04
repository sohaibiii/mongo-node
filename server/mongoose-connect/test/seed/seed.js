const { ObjectID } = require('mongodb')
const jwb = require('jsonwebtoken')

var { Model } = require('../../model')
var { User } = require('../../user')

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
          .sign({ _id: objectid1, access: 'auth' }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  },
  {
    _id: objectid2,
    email: 'mylove123@gmail.com',
    password: 'alibhaiwow9',
    tokens: [
      {
        access: 'auth',
        token: jwb
          .sign({ _id: objectid2, access: 'auth' }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  }
]

var id1 = new ObjectID()
var id2 = new ObjectID()

var todos = [
  {
    _id: id1,
    text: ' what the fuck u want',
    _creator: objectid1
  },
  {
    _id: id2,
    text: 'ni main ne ni jana yar',
    created: true,
    createdAt: 333,
    _creator: objectid2
  }
]

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

const populateTodos = function (done) {
  this.timeout(10000)

  Model.deleteMany({})
    .then(() => {
      Model.insertMany(todos)
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
