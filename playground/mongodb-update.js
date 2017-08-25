// const MongoClient = require('mongodb').MongoClient

const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

  if (err) return console.log('Unable to connect to MongoDB server!')
  console.log('Connected to MongoDB server')

  // db.collection('Todos').findOneAndUpdate({_id: new ObjectID('59a0148122824b2615e3fa6f')}, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result)
  // })

  db.collection('Users').findOneAndUpdate({_id: new ObjectID("59a0171522824b2615e3fad6")}, {
    $set: {
      name: 'Bairei'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((res) => {
    console.log(res)
  })

  // db.close()
})
