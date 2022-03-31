const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  articleId: {
    type: Number,
    required: [true, 'UserId is required'],
  },
  author: {
    type: String,
    required: [true, 'Username is required'],
  },
  created: {
    type: Date,
    required: [true, 'Created date is required'],
  },
  body: {
    type: String,
    required: [true, 'Content is required'],
  },
  image: {
    type: String,
  },
  comments: [
    {
      owner: { type: String },
      created: { type: Date },
      content: { type: String },
    },
  ],
})

module.exports = articleSchema
