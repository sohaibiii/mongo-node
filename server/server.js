require('./config/config')

const express = require('express')
const bodyparser = require('body-parser')
var { mongoose } = require('./mongoose-connect/connection')
const { Model } = require('./mongoose-connect/model')
const { ObjectID } = require('mongodb')
const _ = require('lodash')
const { Authenticatemiddleware } = require('./middleware/authenticate')

const { User } = require('./mongoose-connect/user')
const port = process.env.PORT

const app = express()
app.use(bodyparser.json())
app.post('/todos', Authenticatemiddleware, (req, res) => {
  var model = new Model({
    text: req.body.text,
    _creator: req.user._id
  })
  model.save().then(
    data => {
      res.send(data)
    },
    err => {
      res.status(400).send(err)
    }
  )
})

app.get('/todos', Authenticatemiddleware, (req, res) => {
  Model.find({
    _creator: req.user._id
  }).then(
    todos => {
      res.send({ todos })
    },
    err => {
      res.status(400).send(err)
    }
  )
})

app.get('/todos/:id', Authenticatemiddleware, (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) {
    res.status(404).send()
  } else {
    Model.findOne({
      _id: id,
      _creator: req.user._id
    })
      .then(todo => {
        if (!todo) {
          res.status(404).send()
        } else res.send({ todo })
      })
      .catch(err => {
        res.status(400).send(err)
      })
  }
})

app.delete('/todos/:id', Authenticatemiddleware, (req, res) => {
  const idd = req.params.id
  if (!ObjectID.isValid(idd)) {
    res.status(400).send()
  } else {
    Model.findOneAndDelete({
      _id: idd,
      _creator: req.user._id
    })
      .then(todo => {
        if (!todo) {
          res.status(400).send()
        } else res.send({ todo })
      })
      .catch(err => {
        res.status(400).send(err)
      })
  }
})

app.patch('/todos/:id', Authenticatemiddleware, (req, res) => {
  const id = req.params.id
  var body = _.pick(req.body, ['text', 'created'])
  if (_.isBoolean(body.created) && body.created) {
    body.createdAt = new Date().getTime()
  } else {
    body.created = false
    body.createdAt = null
  }
  if (!ObjectID.isValid(id)) {
    res.status(400).send()
  } else {
    Model.findOneAndUpdate(
      {
        _id: id,
        _creator: req.user._id
      },
      {
        $set: body
      },
      { new: true }
    )
      .then(todo => {
        if (!todo) {
          res.status(400).send()
        } else res.send({ todo })
      })
      .catch(err => {
        res.status(400).send(err)
      })
  }
})

app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password'])
  var user = new User(body)
  user
    .save()
    .then(() => {
      return user.generateAuthToken()
    })
    .then(token => {
      // var user1 = _.pick(user, ['_id', 'email'])

      res.header('x-token', token).send(user)
    })
    .catch(err => {
      res.status(400).send(err)
    })
})

// middleware always run befor the app.get  bcz it is in middle

app.get('/users/me', Authenticatemiddleware, (req, res) => {
  res.send(req.user)
})

// login

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])
  User.findByCredientials(body.email, body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header('x-token', token).send(user)
      })
    })
    .catch(e => {
      res.status(400).send(e)
    })
})

// logout

app.delete('/users/me/token', Authenticatemiddleware, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send()
    },
    err => {
      res.status(400).send(err)
    }
  )
})

app.listen(port, () => {
  console.log(`the server is started at ${port}`)
})

module.exports = {
  app
}
