require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose')
const {User} = require('./models/users')
const {Todo} = require('./models/todos')
const {authenticate} = require('./middleware/authenticate')

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })
  todo.save().then((doc) => {
    res.send((doc))
  }, (e) => {
    if (e) res.status(400).send(e)
  })
})

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos})
  }, (e) => res.status(400).send(e))
})

app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) return res.status(404).send({errorDesc: 'The entered id is not correct!'})
  Todo.findOne({_id: id, _creator: req.user._id}).then((todo) => {
    if (todo) return res.send({todo})
    return res.status(404).send({})
  }, (e) => res.status(400).send({}))
})

app.delete('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) return res.status(404).send({errorDesc: 'The entered id is not correct!'})
  Todo.findOneAndRemove({_id: id, _creator: req.user._id}).then((todo) => {
    if (todo) return res.send({todo})
    res.status(404).send({})
  }).catch((e) => res.status(400).send({}))
})

app.patch('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id
  const body = _.pick(req.body, ['text', 'completed'])
  if (!ObjectID.isValid(id)) return res.status(404).send({errorDesc: 'The entered id is not correct!'})
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }
  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user
  }, {$set: body}, {new: true}).then((todo) => {
    if (!todo) return res.status(404).send()
    res.send({todo})
  }).catch((e) => res.status(400).send({}))
})

// POST /users
app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password'])
  const user = new User(body)
  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((e) => {
    if (e) res.status(400).send(e)
  })
})

// POST /users/login
app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password'])
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user)
    })
  }).catch((e) => {
    res.status(400).send()
  })
})

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  }, () => {
    res.status(400).send()
  })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})

module.exports = {
  app
}
