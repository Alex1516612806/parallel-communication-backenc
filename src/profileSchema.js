const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  headline: {
    type: String,
    required: [true, 'Headline is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  zipcode: {
    type: Number,
    required: [true, 'zipcode is required'],
  },
  dob: {
    type: Date,
    required: [true, 'data of birth is required'],
  },
  avatar: {
    type: String,
    required: [false, 'avatar is not required'],
  },
  following: {
    type: Array,
    required: [false, 'following is not required'],
  },
})

module.exports = profileSchema
