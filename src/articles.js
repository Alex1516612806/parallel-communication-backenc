const mongoose = require('mongoose')
const profileSchema = require('./profileSchema')
const articleSchema = require('./articleSchema')
const uploadImage = require('./uploadCloudinary')
const Profile = mongoose.model('profiles', profileSchema)
const Article = mongoose.model('articles', articleSchema) // Creat and model the database table
const connectionString =
  'mongodb+srv://new-user-26:Wang12345678@cluster0.jjf7h.mongodb.net/riceBook?retryWrites=true&w=majority'
// const uploadImage = require('./uploadCloudinary')
const getArticle = (req, res) => {
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    if (typeof req.params.id === 'undefined') {
      // GET/articles
      // Return all the logged in user's articles and follower's article
      Profile.findOne({ username: req.username }, function (error, profile) {
        let follower = profile.following
        follower.push(req.username)
        Article.find({ author: follower }).exec(function (err, articles) {
          res.send({ articles: articles })
        })
      })
      // TODO:
      // const profile = await Profile.findOne({ username: req.username })
      // let follower = [... profile.following]
      // follower.push(req.username)
      // const article = await Article.findOne({ author: profile.following })
    } else {
      // GET /articles/:id
      if (isNaN(req.params.id)) {
        // Username case
        // Return all request articles by User.
        res.send({ articles: await Article.find({ author: req.params.id }) })
      } else {
        // Post id provided case
        res.send({
          articles: [
            await Article.findOne({
              articleId: parseInt(req.params.id),
            }),
          ],
        })
      }
    }
  })()
}

const addArticle = (req, res) => {
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    // Add a article to the database
    let newArticle = new Article({
      articleId: await Article.count(),
      author: req.username,
      created: Date.now(),
      body: req.body.text,
      comments: [],
      image: typeof req.fileurl === 'undefined' ? '' : req.fileurl,
    })
    await connector.then(() => {
      newArticle.save()
    })
    // Rspone with that single article
    res.send({ articles: [newArticle] })
  })()
}

const editArticle = (req, res) => {
  let update = req.body
  if (update.commentId === null) {
    // Modify article content.
    ;(async () => {
      const connector = mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      let post = await Article.findOne({ articleId: parseInt(req.params.id) })
      // Check whether user is allow to modified the article content.

      if (post.author === req.username) {
        // Allow to modify
        const filter = { articleId: parseInt(req.params.id) }
        const update = { body: req.body.text }
        let newArticle = await Article.findOneAndUpdate(filter, update, {
          new: true,
        })
        // Rspone with that single article
        res.send({ articles: [newArticle] })
      } else {
        res.send('Not authorized to modified')
      }
    })()
  } else {
    ;(async () => {
      const connector = mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      const filter = { articleId: parseInt(req.params.id) } // Get the article that need to add the comment
      if (update.commentId === -1) {
        // Add a new comment
        let update = {
          comments: {
            owner: req.username,
            created: Date.now(),
            content: req.body.text,
          },
        }
        let newArticle = await Article.findOneAndUpdate(filter, update, {
          new: true,
        })
        // Rspone with that single article
        res.send({ articles: [newArticle] })
      } else {
        let article = await Article.findOne(filter)
        if (
          article.comments.length > update.commentId &&
          article.comments[update.commentId].owner === req.username
        ) {
          // Owner of the commnets
          let update = {
            comments: {
              owner: req.username,
              content: req.body.text,
            },
          }
          let newArticle = await Article.findOneAndUpdate(filter, update, {
            new: true,
          })
          res.send({ articles: [newArticle] })
        } else {
          res.send('No authorized to update the comment')
        }
      }
    })()
  }
}

module.exports = (app) => {
  //GET requests go here
  app.get('/articles/:id?', getArticle)

  //POST requests go here
  app.post('/article', uploadImage('article'), addArticle)

  //PUT requests go here
  app.put('/articles/:id', editArticle)
}
