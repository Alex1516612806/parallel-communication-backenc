let sessionUser = {}
let cookieKey = 'sid'
const md5 = require('md5')
const mongoose = require('mongoose')
const userSchema = require('./userSchema')
const User = mongoose.model('user', userSchema) // Creat and model the database table
const profileSchema = require('./profileSchema')
const Profile = mongoose.model('profiles', profileSchema)
const connectionString =
  'mongodb+srv://new-user-26:Wang12345678@cluster0.jjf7h.mongodb.net/riceBook?retryWrites=true&w=majority'

const redis = require('redis').createClient(process.env.REDIS_URL)

function isLoggedIn(req, res, next) {
  // likely didn't install cookie parser
  if (!req.cookies) {
    console.log('Return in if req.cookies statement')
    return res.sendStatus(401)
  }

  let sid = req.cookies[cookieKey]

  // no sid for cookie key
  if (!sid) {
    return res.sendStatus(401)
  }

  let username = sessionUser[sid]
  console.log(username + ' has logged in')
  // no username mapped to sid
  if (username) {
    req.username = username // Put username to all the request
    next()
  } else {
    console.log('Return in if username statement')
    return res.sendStatus(401)
  }
}

function login(req, res) {
  let username = req.body.username
  let password = req.body.password

  // supply username and password
  if (!username || !password) {
    return res.sendStatus(400)
  }
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    let user = await User.findOne({ username: username })
    if (!user) {
      return res.sendStatus(401)
    }
    // Create hash using md5, user salt and request password, check if hash matches user hash
    let hash = md5(user.salt + password)
    if (hash === user.hash) {
      //Check user password correct or not
      // Create session id, use sessionUser to map sid to user username
      let sid = md5(user.hash + user.salt)
      sessionUser[sid] = user.username // Create a new sessionUser positon. if the username and password correct, we can pass forward and back
      // Adding cookie for session id
      res.cookie(cookieKey, sid, {
        maxAge: 3600 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      }) // maxAge: Valide for one hour, httpOnly: make sure document.cookie cannot access to it
      // let msg = { username: username, result: 'success', sid: sid }
      let msg = { username: username, result: 'success' }

      //Use Redis
      // redis.hmset('sessions', sid, JSON.stringify(msg))
      // redis.hgetall('sessions', function (error, object) {})

      res.send(msg)
    } else {
      res.sendStatus(401)
    }
  })()
}

function register(req, res) {
  let username = req.body.username
  let email = req.body.email
  let dob = req.body.dob
  let zipcode = req.body.zipcode
  let password = req.body.password
  // supply username and password
  if (!username || !password) {
    return res.sendStatus(400)
  }
  let salt = username + new Date().getTime() // Create random value for salt
  let hash = md5(salt + password) // Change this to use md5 to create a hash
  // Connect to database and store all the information.
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    let check = await User.findOne({ username: username })
    if (check !== null) {
      console.log('Username has already taken')
      return res.send({
        username: username,
        result: 'unsuccess: Username has already taken',
      })
    }
    // Add username, hash, salt to the database
    let newUser = new User({
      userId: await User.count(),
      username: username,
      salt: salt,
      hash: hash,
      created: Date.now(),
    })
    // Add rest of the information to profile database
    let newProfile = new Profile({
      username: username,
      headline: 'Say something about you',
      email: email,
      zipcode: zipcode,
      dob: dob,
      avatar:
        'https://news.rice.edu/sites/g/files/bxs2656/files/2019-08/Shield.png',
      following: [],
    })
    await connector.then(() => {
      newUser.save()
      newProfile.save()
    })

    // Login user same time
    let sid = md5(hash + salt)
    sessionUser[sid] = username // Create a new sessionUser positon. if the username and password correct, we can pass forward and back
    // Adding cookie for session id
    res.cookie(cookieKey, sid, {
      maxAge: 3600 * 1000,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    }) // maxAge: Valide for one hour, httpOnly: make sure document.cookie cannot access to it
    res.send({ result: 'success', username: username })
  })()
}

function logout(req, res) {
  if (!req.cookies) {
    console.log('Return in if req.cookies statement')
    return res.sendStatus(401)
  }
  let sid = req.cookies[cookieKey]
  // no sid for cookie key
  if (!sid) {
    return res.sendStatus(401)
  }
  let username = sessionUser[sid]
  if (username) {
    req.username = ''
    console.log('Loging our user ' + username)
    sessionUser[sid] = '' // Clean the sessionUser
    // Clean the cookie
    // res.cookie(cookieKey, sid, { maxAge: Date.now(), httpOnly: true })
    res.cookie(cookieKey, sid, { maxAge: 0, httpOnly: true })
  } else {
    return res.sendStatus(401)
  }
  // If log success
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200
  res.end(JSON.stringify('OK') + '\n')
}

function editPassword(req, res) {
  if (!req.body.password) {
    return res.sendStatus(400)
  }
  ;(async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    let salt = req.username + new Date().getTime() // Create random value for salt
    let hash = md5(salt + req.body.password) // Change this to use md5 to create a hash
    const filter = { username: req.username }
    const update = { salt: salt, hash: hash }
    let user = await User.findOneAndUpdate(filter, update, { new: true })
    if (!user) {
      res.sendStatus(401)
    }
  })()
  res.send({ username: req.username, result: 'success' })
}

module.exports = (app) => {
  // POST requests go here
  app.post('/login', login)
  app.post('/register', register)

  app.use(isLoggedIn) // Middleware

  // PUT requests go here
  app.put('/password', editPassword)
  app.put('/logout', logout)
}
