const auth = require('./src/auth') // Get export function from auth.js
const profile = require('./src/profile')
const articles = require('./src/articles')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const corsOptions = { origin: 'http://localhost:3000', credentials: true }

// const corsOptions = {
//   origin: 'https://parallel-communication.surge.sh',
//   credentials: true,
// }

const upCloud = require('./src/uploadCloudinary.js')

// MongoDB stuff
const mongoose = require('mongoose')
const userSchema = require('./src/userSchema')
// const articleSchema = require('./src/articleSchema')
const profileSchema = require('./src/profileSchema')
const User = mongoose.model('user', userSchema) // Creat and model the database table
// const Article = mongoose.model('articles', articleSchema) // Creat and model the database table
const Profile = mongoose.model('profiles', profileSchema)
const connectionString =
  'mongodb+srv://new-user-26:Wang12345678@cluster0.jjf7h.mongodb.net/riceBook?retryWrites=true&w=majority'

const welcome = (req, res) => {
  return res.send({
    welcome: 'Hello ParalCom From Backend',
    front: 'https://paralCom.surge.sh',
  })
}

//Order matter!!
const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.get('/', welcome)

app.use(
  session({
    secret: 'doNotGuessTheSecret',
    resave: true,
    saveUninitialized: true,
  })
)

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '586513184181-gjvqqg7ngujqimipokghk8f4gkacqs0v.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      let user = {
        /*'email': profile.emails[0].value,
            'name' : profile.name.givenName + ' ' + profile.name.familyName,
            'id'   : profile.id,*/
        token: accessToken,
      }
      // You can perform any necessary actions with your user at this point,
      // e.g. internal verification against a users table,
      // creating new user entries, etc.

      return done(null, user)
      // User.findOrCreate(..., function(err, user) {
      //     if (err) { return done(err); }
      //     done(null, user);
      // });
    }
  )
)
// Redirect the user to Google for authentication.  When complete,
// Google will redirect the user back to the application at
//     /auth/google/callback
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'email'],
  })
) // could have a passport auth second arg {scope: 'email'}

// Google will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'https://parallel-communication.surge.sh',
    failureRedirect: '/',
  })
)

auth(app) // Add endpoints

//profile.js
profile(app)

//articles.js
articles(app)

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3001
const server = app.listen(port, '127.0.0.1', () => {
  const addr = server.address()
  console.log(`Server listening at http://${addr.address}:${addr.port}`)
})
