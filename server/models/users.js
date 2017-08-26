const mongoose = require('mongoose')

const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  name: {
    type: String,
    trim: true
  }
})

module.exports = {
  User
}
