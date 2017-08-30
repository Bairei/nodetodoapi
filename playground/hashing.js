const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')

const data = {
  id: 10
}

const token = jwt.sign(data, '123abc')
// jwt.verify()

console.log(token)

const decoded = jwt.verify(token, '123abc')

console.log('decoded', decoded)

// const message = 'I am user no.3'
// const hash = SHA256(message).toString()
// console.log(`message: ${message}, hashed: ${hash}`)

// const data = {
//   id: 4
// }
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'secret').toString()
// }

// token.data.id = 5
// token.hash = SHA256(JSON.stringify(token.data)).toString()
// const hashResult = SHA256(JSON.stringify(token.data) + 'secret').toString()

// if (hashResult === token.hash) console.log('Data not changed')
// else console.log("Data was changed, don't trust!!!")
