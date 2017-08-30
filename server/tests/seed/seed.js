const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const {Todo} = require('./../../models/todos')
const {User} = require('./../../models/users')

const user1ID = new ObjectID()
const user2ID = new ObjectID()

const users = [{
  _id: user1ID,
  email: 'bairei@mail.com',
  password: 'user1pass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: user1ID, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: user2ID,
  email: 'bairei2@mail.com',
  password: 'user2pass'
}]

const todos = [{
  _id: new ObjectID(123),
  text: 'dummy todo no.1'
}, {
  _id: new ObjectID(456),
  text: 'dummy todo no.2'
}, {
  _id: new ObjectID(789),
  text: 'dummy todo no.3',
  completed: true,
  completedAt: new Date().getTime()
}, {
  _id: new ObjectID(101112),
  text: 'dummy todo no.4'
}]

const populateTodos = ((done) => {
  Todo.remove().then(() => {
    return Todo.insertMany(todos)
  }).then(() => done())
})

const populateUsers = ((done) => {
  User.remove().then(() => {
    const userOne = new User(users[0]).save()
    const userTwo = new User(users[1]).save()
    return Promise.all([userOne, userTwo])
    }).then(() => done())
})

module.exports = {
  todos, populateTodos, users, populateUsers
}
