require('../config/config')

const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose')
const {User} = require('./models/users')
const {Todo} = require('./models/todos')

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  })
  todo.save().then((doc) => {
    res.send((doc))
  }, (e) => {
    if (e) res.status(400).send(e)
  })
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }, (e) => res.status(400).send(e))
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) return res.status(404).send({errorDesc: 'The entered id is not correct!'})
  Todo.findById(id).then((todo) => {
    if (todo) return res.send({todo})
    return res.status(404).send({})
  }, (e) => res.status(400).send({}))
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id)) return res.status(404).send({errorDesc: 'The entered id is not correct!'})
  Todo.findByIdAndRemove(id).then((todo) => {
    if (todo) return res.send({todo})
    res.status(404).send({})
  }).catch((e) => res.status(400).send({}))
})

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id
  const body = _.pick(req.body, ['text', 'completed'])
  if (!ObjectID.isValid(id)) return res.status(404).send({errorDesc: 'The entered id is not correct!'})
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) return res.status(404).send()
    res.send({todo})
  }).catch((e) => res.status(400).send({}))
})

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})

module.exports = {
  app
}