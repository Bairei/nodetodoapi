const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const pass = 'abc123!'

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(pass, salt, (err, hash) => {
//     console.log(hash)
//   })
// })

const hashedPass = '$2a$10$bvjRPuktwX1AqtFLRA4fUOpRkaz6akDTqwI/JaBSolq6px3C7Cs2q'

bcrypt.compare(pass, hashedPass, (err, res) => {
  console.log(res)
})

// const data = {
//   id: 10
// }

// const token = jwt.sign(data, '123abc')
// // jwt.verify()

// console.log(token)

// const decoded = jwt.verify(token, '123abc')

// console.log('decoded', decoded)

// // const message = 'I am user no.3'
// // const hash = SHA256(message).toString()
// // console.log(`message: ${message}, hashed: ${hash}`)

// // const data = {
// //   id: 4
// // }
// // const token = {
// //   data,
// //   hash: SHA256(JSON.stringify(data) + 'secret').toString()
// // }

// // token.data.id = 5
// // token.hash = SHA256(JSON.stringify(token.data)).toString()
// // const hashResult = SHA256(JSON.stringify(token.data) + 'secret').toString()

// // if (hashResult === token.hash) console.log('Data not changed')
// // else console.log("Data was changed, don't trust!!!")
