const mongoose = require('mongoose')
// const userSchema = require('./userSchema')
const profileSchema = require('./profileSchema')
const Profile = mongoose.model('profiles', profileSchema) // Creat and model the database table
// const User = mongoose.model('user', userSchema)
const connectionString =
  'mongodb+srv://new-user-26:Wang12345678@cluster0.jjf7h.mongodb.net/riceBook?retryWrites=true&w=majority'

const uploadImage = require('./uploadCloudinary')
// this is profile.js which contains all user profile
// information except passwords which is in auth.js

/* GET Method implementation */
const getHeadline = (req, res) => {
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    if (typeof req.params.user === 'undefined') {
      // If params.user is not specified, return logged in user's information
      let profile = await Profile.findOne({ username: req.username })
      res.send({ username: req.username, headline: profile.headline })
    } else {
      // If params.user is specified, return that requested user's information
      let profile = await Profile.findOne({ username: req.params.user })
      if (profile === null) {
        // If user is not find.
        res.send({
          username: req.params.user,
          headline: "Specific user's headline not found",
        })
      } else {
        res.send({ username: req.params.user, headline: profile.headline })
      }
    }
  })()
}

const getFollowerInfo = (req, res) => {
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    if (typeof req.params.user === 'undefined') {
      // If params.user is not specified, return logged in user's information
      let profile = await Profile.findOne({ username: req.username })
      res.send({
        username: req.username,
        headline: profile.headline,
        avatar: profile.avatar,
      })
    } else {
      // If params.user is specified, return that requested user's information
      let profile = await Profile.findOne({ username: req.params.user })
      if (profile === null) {
        // If user is not find.
        res.send({
          username: req.params.user,
          headline: "Specific user's headline not found",
          avatar: '',
        })
      } else {
        res.send({
          username: req.params.user,
          headline: profile.headline,
          avatar: profile.avatar,
        })
      }
    }
  })()
}

const getEmail = (req, res) => {
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    if (typeof req.params.user === 'undefined') {
      // If params.user is not specified, return logged in user's information
      let profile = await Profile.findOne({ username: req.username })
      res.send({ username: req.username, email: profile.email })
    } else {
      // If params.user is specified, return that requested user's information
      let profile = await Profile.findOne({ username: req.params.user })
      if (profile === null) {
        // If user is not find.
        res.send({
          username: req.params.user,
          email: "Specific user's email not found",
        })
      } else {
        res.send({ username: req.params.user, email: profile.email })
      }
    }
  })()
}
const getDob = (req, res) => {
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    if (typeof req.params.user === 'undefined') {
      // If params.user is not specified, return logged in user's information
      let profile = await Profile.findOne({ username: req.username })
      res.send({ username: req.username, dob: profile.dob })
    } else {
      // If params.user is specified, return that requested user's information
      let profile = await Profile.findOne({ username: req.params.user })
      if (profile === null) {
        // If user is not find.
        res.send({
          username: req.params.user,
          dob: "Specific user's data of birth not found",
        })
      } else {
        res.send({ username: req.params.user, dob: profile.dob })
      }
    }
  })()
}
const getZipcode = (req, res) => {
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    if (typeof req.params.user === 'undefined') {
      // If params.user is not specified, return logged in user's information
      let profile = await Profile.findOne({ username: req.username })
      res.send({ username: req.username, zipcode: profile.zipcode })
    } else {
      // If params.user is specified, return that requested user's information
      let profile = await Profile.findOne({ username: req.params.user })
      if (profile === null) {
        // If user is not find.
        res.send({
          username: req.params.user,
          zipcode: "Specific user's zipcode not found",
        })
      } else {
        res.send({ username: req.params.user, zipcode: profile.zipcode })
      }
    }
  })()
}
const getAvatar = (req, res) => {
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    if (typeof req.params.user === 'undefined') {
      // If params.user is not specified, return logged in user's information
      let profile = await Profile.findOne({ username: req.username })
      res.send({ username: req.username, avatar: profile.avatar })
    } else {
      // If params.user is specified, return that requested user's information
      let profile = await Profile.findOne({ username: req.params.user })
      if (profile === null) {
        // If user is not find.
        res.send({
          username: req.params.user,
          avatar: "Specific user's avatar not found",
        })
      } else {
        res.send({ username: req.params.user, avatar: profile.avatar })
      }
    }
  })()
}

const getFollowing = (req, res) => {
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    if (typeof req.params.user === 'undefined') {
      // If params.user is not specified, return logged in user's information
      let profile = await Profile.findOne({ username: req.username })
      res.send({ username: req.username, following: profile.following })
    } else {
      // If params.user is specified, return that requested user's information
      let profile = await Profile.findOne({ username: req.params.user })
      if (profile === null) {
        // If user is not find.
        res.send({
          username: req.params.user,
          following: "Specific user's following not found",
        })
      } else {
        res.send({ username: req.params.user, following: profile.following })
      }
    }
  })()
}

/* PUT Method implementation */
const editHeadline = (req, res) => {
  if (!req.body.headline) {
    return res.sendStatus(400)
  }
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    const filter = { username: req.username }
    const update = { headline: req.body.headline }
    let newProfile = await Profile.findOneAndUpdate(filter, update, {
      new: true,
    })
    if (!newProfile) {
      res.sendStatus(401)
    }
    res.send({ username: req.username, headline: newProfile.headline })
  })()
}

const editEmail = (req, res) => {
  if (!req.body.email) {
    return res.sendStatus(400)
  }
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    const filter = { username: req.username }
    const update = { email: req.body.email }
    let user = await Profile.findOneAndUpdate(filter, update, { new: true })
    if (!user) {
      res.sendStatus(401)
    }
    res.send({ username: req.username, email: user.email })
  })()
}
const editZipcode = (req, res) => {
  if (!req.body.zipcode) {
    return res.sendStatus(400)
  }
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    const filter = { username: req.username }
    const update = { zipcode: req.body.zipcode }
    let user = await Profile.findOneAndUpdate(filter, update, { new: true })
    if (!user) {
      res.sendStatus(401)
    }
    res.send({ username: req.username, zipcode: user.zipcode })
  })()
}

const editAvatar = (req, res) => {
  if (!req.fileurl) {
    return res.sendStatus(400)
  }
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    const filter = { username: req.username }
    const update = { avatar: req.fileurl }
    let user = await Profile.findOneAndUpdate(filter, update, { new: true })

    if (!user) {
      res.sendStatus(401)
    }
    res.send({ username: req.username, avatar: req.fileurl })
  })()
}

const addFollowing = (req, res) => {
  if (!req.params.user) {
    return res.sendStatus(400)
  }
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    // Check the user is a valid user or not
    let check = await Profile.findOne({ username: req.params.user })
    if (check === null) {
      console.log('Not matched user')
      return res.send({ username: req.username, following: 'Not matched user' })
    }
    // Find current logged in user's profile
    const filter = { username: req.username }
    let profile = await Profile.findOne(filter)
    profile.following.push(req.params.user)
    const update = { following: profile.following }
    let user = await Profile.findOneAndUpdate(filter, update, { new: true })
    if (!user) {
      res.sendStatus(401)
    }
    res.send({ username: req.username, following: profile.following })
  })()
}

const deleteFollowing = (req, res) => {
  if (!req.params.user) {
    return res.sendStatus(400)
  }
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    // Find current logged in user's profile
    const filter = { username: req.username }
    let profile = await Profile.findOne(filter)
    if (profile.following.indexOf(req.params.user) > -1) {
      profile.following.splice(profile.following.indexOf(req.params.user), 1)
    }
    const update = { following: profile.following }
    let user = await Profile.findOneAndUpdate(filter, update, { new: true })
    if (!user) {
      res.sendStatus(401)
    }
    res.send({ username: req.username, following: profile.following })
  })()
}

module.exports = (app) => {
  //GET requests go here
  // app.get('/profile', getProfile)
  app.get('/headline/:user?', getHeadline)
  app.get('/email/:user?', getEmail)
  app.get('/dob/:user?', getDob)
  app.get('/zipcode/:user?', getZipcode)
  app.get('/avatar/:user?', getAvatar)
  app.get('/following/:user?', getFollowing)
  app.get('/follower_info/:user?', getFollowerInfo)

  //PUT requests go here
  app.put('/headline', editHeadline)
  app.put('/email', editEmail)
  app.put('/zipcode', editZipcode)
  app.put('/avatar', uploadImage('avatar'), editAvatar)
  app.put('/following/:user', addFollowing)

  //DELET requrest goes here
  app.delete('/following/:user', deleteFollowing)
}
