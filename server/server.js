const express = require('express')
const bodyparser = require('body-parser')
var { mongoose } = require('./mongoose-connect/connection')
const { Model } = require('./mongoose-connect/model')
const { ObjectID } = require('mongodb')

const { Student } = require('./mongoose-connect/user')

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

app.listen(3000, () => {
  console.log('the server is started')
})

module.exports = {
  app
}
