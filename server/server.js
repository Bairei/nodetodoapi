const express = require('express')
const bodyParser = require('body-parser')

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
  }, (e) => {res.status(400).send(e)})
})

app.listen(3000, () => {
  console.log('App listening on port 3000!');
})

module.exports = {
  app
}