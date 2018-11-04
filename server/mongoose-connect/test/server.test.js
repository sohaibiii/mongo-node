const expect = require('expect')
const request = require('supertest')
var { ObjectID } = require('mongodb')

var { Model } = require('./../model')
var { User } = require('./../user')
var { app } = require('./../../server')
var { todos, populateTodos, userdata, populateUsers } = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('Todo-Post', function () {
  it('post-verification', function (done) {
    // this.timeout(10000)
    var text = 'this is my testing data'

    request(app)
      .post('/todos')
      .set('x-token', userdata[0].tokens[0].token)
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
    request(app)
      .post('/todos')
      .set('x-token', userdata[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
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
      .set('x-token', userdata[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1)
      })
      .end(done)
  })
  describe('Todos of get method by ids', () => {
    it('TODO by id', done => {
      var ids = todos[1]._id.toHexString()

      request(app)
        .get(`/todos/${ids}`)
        .set('x-token', userdata[1].tokens[0].token)
        .expect(200)
        .expect(res => {
          expect(res.body.todo._id).toBe(ids)
          expect(res.body.todo.text).toBe(todos[1].text)
        })
        .end(done)
    })
    it('TODO not by id if user changes', done => {
      const ids = todos[0]._id.toHexString()
      request(app)
        .get(`/todos/${ids}`)
        .set('x-token', userdata[1].tokens[0].token)
        .expect(404)
        .end(done)
    })
    it('if id-todo not found', done => {
      const d = new ObjectID().toHexString()
      request(app)
        .get(`/todos/${d}`)
        .set('x-token', userdata[1].tokens[0].token)
        .expect(404)
        .end(done)
    })
    it('invaid id', done => {
      request(app)
        .get('/todos/qwewe3243')
        .set('x-token', userdata[1].tokens[0].token)
        .expect(404)
        .end(done)
    })
  })
})

describe('delete todos', () => {
  it('delete by ids', done => {
    var id = todos[1]._id.toHexString()
    request(app)
      .delete(`/todos/${id}`)
      .set('x-token', userdata[1].tokens[0].token)
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
  it('delete not by ids if user changes', done => {
    var id = todos[1]._id.toHexString()
    request(app)
      .delete(`/todos/${id}`)
      .set('x-token', userdata[0].tokens[0].token)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Model.findById(id)
          .then(model => {
            expect(model).toBeTruthy() // it is used instead of toNotExists()
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
      .set('x-token', userdata[0].tokens[0].token)
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
  it('updating not throug id if creator changes', done => {
    var id = todos[1]._id.toHexString()
    var text = 'ap mjhe btao k kia ho raha hai'

    request(app)
      .patch(`/todos/${id}`)
      .set('x-token', userdata[0].tokens[0].token)
      .send({
        created: true,
        text
      })
      .expect(400)
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
      .set('x-token', userdata[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.created).toBe(false)
        expect(res.body.todo.createdAt).toBeFalsy()
      })
      .end(done)
  })
})

describe('user get request', () => {
  it('get user by token', done => {
    request(app)
      .get('/users/me')
      .set('x-token', userdata[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(userdata[0]._id.toHexString())
        expect(res.body.email).toBe(userdata[0].email)
      })
      .end(done)
  })
  it('get 401 if token not given', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe('user post ', () => {
  it('user post to enter data ensure', done => {
    var email = 'sohaiba3343@gmail.com'
    var password = 'mynameiskhanand'
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-token']).toBeTruthy()
        expect(res.body._id).toBeTruthy()
        expect(res.body.email).toBe(email)
      })
      .end(err => {
        if (err) {
          return done(err)
        } else {
          User.findOne({ email })
            .then(user => {
              expect(user).toBeTruthy()
              expect(user.password).not.toBe(password)
              done()
            })
            .catch(e => {
              return done(e)
            })
        }
      })
  })

  it('check if email and pass is unvalid', done => {
    request(app)
      .get('/users')
      .send({
        email: 'alihgj34',
        password: 'hghhg'
      })
      .expect(404)
      .end(done)
  })

  it('check if email is already exists then err', done => {
    request(app)
      .get('/users')
      .send({
        email: userdata[0].email,
        password: 'hghhg5465gfdfgd'
      })
      .expect(404)
      .end(done)
  })
})
describe('login testing', () => {
  it('login', done => {
    request(app)
      .post('/users/login')
      .send({
        email: userdata[1].email,
        password: userdata[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-token']).toBeTruthy()
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        } else {
          User.findById(userdata[1]._id)
            .then(user => {
              expect(user.toObject().tokens[1]).toMatchObject({
                access: 'auth',
                token: res.headers['x-token']
              })
              expect(user.email).toBe(userdata[1].email)
              done()
            })
            .catch(err => {
              return done(err)
            })
        }
      })
  })
  it('err with invalid email and pass', done => {
    request(app)
      .post('/users/login')
      .send({
        email: 'sohaibasdad@gmail.com',
        password: 'alibhaiwow9'
      })
      .expect(400)
      .end(done)
  })
})

describe('logout users', () => {
  it('delete the token by sedning it', done => {
    request(app)
      .delete('/users/me/token')
      .set('x-token', userdata[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        User.findById(userdata[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0)
            done()
          })
          .catch(err => {
            return done(err)
          })
      })
  })
})
