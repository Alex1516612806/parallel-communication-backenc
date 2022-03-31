const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: [true, 'UserId is required'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  salt: {
    type: String,
    required: [true, 'Salt is not detected'],
  },
  hash: {
    type: String,
    required: [true, 'Hash is not detected'],
  },
  created: {
    type: Date,
    required: [true, 'Created date is required'],
  },
})

module.exports = userSchema
