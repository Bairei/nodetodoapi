const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose')
const {User} = require('./models/users')
const {Todo} = require('./models/todos')

const app = express()
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
  Todo.findById(id).then((result) => {
    if (result) return res.send(result)
    return res.status(404).send({})
  }, (e) => res.status(400).send({}))
})

app.listen(3000, () => {
  console.log('App listening on port 3000!');
})

module.exports = {
  app
}