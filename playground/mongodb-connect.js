// const MongoClient = require('mongodb').MongoClient

const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

  if (err) return console.log('Unable to connect to MongoDB server!')
  console.log('Connected to MongoDB server')

  // db.collection('Todos').insertOne({
  //   text: 'something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) return console.log('unable to insert Todo!', err)
  //   console.log(JSON.stringify(result.ops, undefined, 2))
  // })

  // db.collection('Users').insertOne({
  //   name: 'Bairei',
  //   age: 25,
  //   location: 'Poland'
  // }, (err, result) => {
  //   if (err) return console.log('unable to insert an user', err)
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2))
  // })

  // db.collection('Todos').find({_id: new ObjectID('599ffccb6564971aec8f69d8')}).toArray().then((docs) => {
  //   console.log('todos')
  //   console.log(JSON.stringify(docs, undefined, 2))
  // }, (error) => {
  //   if (error) console.log('unable to complete the query:', error)
  // })

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`todos count: ${count}`)
  // }, (error) => {
  //   if (error) console.log('unable to complete the query:', error)
  // })

  db.collection('Users').find({name: 'Bairei'}).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2))
  }, (error) => {
    if (error) console.log('unable to complete the query:', error)
  })

  // db.close()
})
