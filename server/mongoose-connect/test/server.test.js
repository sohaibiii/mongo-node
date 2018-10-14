const expect = require('expect')
const request = require('supertest')

var { Model } = require('./../model')
var { app } = require('./../../server')

beforeEach(done => {
  Model.remove({}).then(() => {
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

        Model.find()
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
          expect(todos.length).toBe(0)
          done()
        })
        .catch(err => {
          return done(err)
        })
    })
  })
})
