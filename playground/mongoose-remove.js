const {ObjectID} = require('mongodb')

const {mongoose} = require('../server/db/mongoose')
const {Todo} = require('../server/models/todos')
const {User} = require('../server/models/users')

Todo.findByIdAndRemove('59a1790ddebb39a0e75e329b').then((todo) => {
  console.log(todo)
})
