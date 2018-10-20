const express = require('express')
const bodyparser = require('body-parser')
var { mongoose } = require('./mongoose-connect/connection')
const { Model } = require('./mongoose-connect/model')
const { ObjectID } = require('mongodb')
const _ = require('lodash')

const { Student } = require('./mongoose-connect/user')
const port = process.env.PORT || 3000

const app = express()
app.use(bodyparser.json())
app.post('/todos', (req, res) => {
  var model = new Model({
    text: req.body.text
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

app.get('/todos', (req, res) => {
  Model.find().then(
    todos => {
      res.send({ todos })
    },
    err => {
      res.status(400).send(err)
    }
  )
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) {
    res.status(400).send()
  } else {
    Model.findById(id)
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

app.delete('/todos/:id', (req, res) => {
  const idd = req.params.id
  if (!ObjectID.isValid(idd)) {
    res.status(400).send()
  } else {
    Model.findByIdAndDelete(idd)
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

app.patch('/todos/:id', (req, res) => {
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
    Model.findByIdAndUpdate(
      id,
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

app.listen(port, () => {
  console.log(`the server is started at ${port}`)
})

module.exports = {
  app
}
