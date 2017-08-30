const request = require('supertest')
const expect = require('expect')
const {ObjectID} = require('mongodb')

const {app} = require('../server')
const {Todo} = require('../models/todos')
const {User} = require('../models/users')
const {todos, users, populateTodos, populateUsers} = require('./seed/seed')

beforeEach(populateTodos)
beforeEach(populateUsers)

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'test todo text'

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) return done(err)
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1)
          expect(todos[0].text).toBe(text)
          done()
        }).catch((e) => done(e))
      })
  })

  it('should NOT create todo with invalid body data', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)

        Todo.find().then((todos) => {
          expect(todos.length).toBe(4)
          done()
        }).catch((e) => done(e))
      })
  })
})

describe('GET /todos app', (done) => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(4)
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for invalid id', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .expect((res) => {
        expect(res.body).toInclude({errorDesc: 'The entered id is not correct!'})
      })
      .end(done)
  })
})

describe('DELETE /todos/:id', () => {

  it('should delete todo', (done) => {
    var hexID = todos[1]._id.toHexString()

    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexID)
      })
      .end((err, res) => {
        if (err) return done(err)
        Todo.findById(hexID).then((todo) => {
          expect(todo).toNotExist()
          done()
        }).catch((e) => done(e))
      })
  })

  it('should return 404 if todo not found', (done) => {
      request(app)
        .delete(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done)
  })

  it('should return 404 if ObjectID is invalid', (done) => {
      request(app)
        .delete(`/todos/123`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toInclude({errorDesc: 'The entered id is not correct!'})
        })
        .end(done)
  })
})

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    const id = todos[0]._id.toHexString()
    const testText = 'Updated with test'
    request(app)
      .patch(`/todos/${id}`)
      .send({text: testText, completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo).toInclude({text: testText})
        expect(res.body.todo.completed).toBe(true)
        expect(res.body.todo.completedAt).toBeA('number')
      })
      .end(done)
  })

  it('should clear completedAt when todo is not completed', (done) => {
    const id = todos[3]._id.toHexString()
    const text = 'random text'
    request(app)
      .patch(`/todos/${id}`)
      .send({completed: false, text})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo).toInclude({text})
        expect(res.body.todo.completed).toBe(false)
        expect(res.body.todo.completedAt).toNotExist()
      })
      .end(done)
  })
})

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get(`/users/me`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })
  it ('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body.email).toNotExist()
      })
      .end(done)

  })
})

describe('POST /users', () => {
  it('should create a user', (done) => {
    const email = 'baireikawagishiex@ex.com'
    const password = '123asdff?'
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist()
        expect(res.body._id).toExist()
        expect(res.body.email).toBe(email)
      })
      .end((err) => {
        if (err) return done(err)
        User.findOne({email}).then((user) => {
          expect(user).toExist()
          expect(user.password).toNotBe(password)
          done()
        })
      })
  })
  it('should return 400 error if request invalid', (done) => {
    const email = 'biehjbeorijh'
    const password = '12'
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  })
  it('should not create a user if email in use', (done) => {
    const email = users[0].email
    const password = 'opsmv32'
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  })
})
