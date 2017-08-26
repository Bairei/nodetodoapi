const {ObjectID} = require('mongodb')

const {mongoose} = require('../server/db/mongoose')
const {Todo} = require('../server/models/todos')
const {User} = require('../server/models/users')

// const id = '69a161c4a3c66e07d81a90531'

// if (!ObjectID.isValid(id)) {
//   console.log('Id not valid!')
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   if (todos.length === 0) return console.log('No todos found')
//   console.log('todos:', todos)
// })

// Todo.findOne({
//   _id: id
// }).then((result) => {
//   if (!result) return console.log('Id not found')
//   console.log('todo:', result)
// })

// Todo.findById(id).then((res) => {
//   if (!res) return console.log('Id not found')
//   console.log('todo by Id:', res)
// }).catch((e) => console.log(e))

const id = '59a0248f71b5603b30a150dc'
const wrongId = '69a0248f71b5603b30a150dc'
const invalidId= '59a0248f71b5603b30a150dc1'

if (!ObjectID.isValid(id)) console.log('Invalid id!')

User.findById(id).then((res) => {
  if (!res) return console.log('Id not found')
  console.log('user by Id:', JSON.stringify(res, undefined, 2))
}, (e) => console.log(e))
