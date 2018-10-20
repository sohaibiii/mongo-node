const expect = require('expect')
const request = require('supertest')
var { ObjectID } = require('mongodb')

var { Model } = require('./../model')
var { app } = require('./../../server')
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

beforeEach(done => {
  Model.remove({})
    .then(() => {
      Model.insertMany(todos)
    })
    .then(() => {
      done()
    })
})

describe('Todo-Post', () => {
  it('post-verification', done => {
    var text = 'this is my testing data'

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Model.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1)
            expect(todos[0].text).toBe(text)
            done()
          })
          .catch(err => {
            return done(err)
          })
      })
  })

  it('should not be created with invallid object', done => {
    request(app).post('/todos').send({}).expect(400).end((err, res) => {
      if (err) {
        return done(err)
      }
      Model.find()
        .then(todos => {
          expect(todos.length).toBe(2)
          done()
        })
        .catch(err => {
          return done(err)
        })
    })
  })
})

describe('Todos of Get methods', () => {
  it('Get all objects', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
  describe('Todos of get method by ids', () => {
    it('TODO by id', done => {
      const ids = todos[1]._id.toHexString()
      request(app)
        .get(`/todos/${ids}`)
        .expect(200)
        .expect(res => {
          expect(res.body.todo._id).toBe(ids)
          expect(res.body.todo.text).toBe(todos[1].text)
        })
        .end(done)
    })
    it('if id-todo not found', done => {
      const d = new ObjectID().toHexString()
      request(app).get(`/todos/${d}`).expect(400).end(done)
    })
    it('invaid id', done => {
      request(app).get('/todos/qwewe3243').expect(400).end(done)
    })
  })
})

describe('delete todos', () => {
  it('delete by ids', done => {
    var id = todos[1]._id.toHexString()
    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(id)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Model.findById(id)
          .then(model => {
            expect(model).toBeFalsy() // it is used instead of toNotExists()
            done()
          })
          .catch(err => {
            return done(err)
          })
      })
  })
})

describe('updateing todos', () => {
  it('updating throug id', done => {
    var id = todos[0]._id.toHexString()
    var text = 'ap mjhe btao k kia ho raha hai'

    request(app)
      .patch(`/todos/${id}`)
      .send({
        created: true,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.created).toBe(true)
        expect(typeof res.body.todo.createdAt).toBe('number')
      })
      .end(done)
  })

  it(' false createdAt will be null', done => {
    const id2 = todos[1]._id.toHexString()
    var text = 'yr ni esa ni hta'

    request(app)
      .patch(`/todos/${id2}`)
      .send({
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.created).toBe(false)
        expect(res.body.todo.createdAt).toBeFalsy()
      })
      .end(done)
  })
})
