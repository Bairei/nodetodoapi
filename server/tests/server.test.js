const request = require('supertest')
const expect = require('expect')
const {ObjectID} = require('mongodb')

const {app} = require('../server')
const {Todo} = require('../models/todos')

const todos = [{
  _id: new ObjectID(123),
  text: 'dummy todo no.1'
}, {
  _id: new ObjectID(456),
  text: 'dummy todo no.2'
}, {
  _id: new ObjectID(789),
  text: 'dummy todo no.3'
}, {
  _id: new ObjectID(101112),
  text: 'dummy todo no.4'
}]

beforeEach((done) => {
  Todo.remove().then(() => {
    return Todo.insertMany(todos)
  }).then(() => done())
})

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