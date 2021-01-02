const express = require('express')
const app = express()
const port = 3000
const cookieSession = require('cookie-session');

app.set('views', './views')
app.set('view engine', 'pug')
app.use(express.urlencoded())
app.use(cookieSession({ secret: 'superdupersecret' }));

// Home Page
app.get('/', (req, res) => {
  res.redirect('/user')
})

// Welcome Page
app.get('/user', (req, res) => {
  let name = 'cajuwi';
  res.render('welcome', { name: name })
})

// Save user's name
app.post('/user', (req, res) => {
  req.session.name = req.body.name
  res.redirect('/chat')
})

// Main Chat Page
app.get('/chat', (req, res) => {
  if (!req.session.messageHistory) {
    req.session.messageHistory = [];
  }
  res.render('chat', { name: req.session.name,
                       messageHistory: req.session.messageHistory })
})

// Save chat messages
app.post('/chat', (req, res) => {
  if (!req.session.messageHistory) {
    req.session.messageHistory = [];
  }
  let message = req.body.message;
  req.session.messageHistory.push(message);
  res.redirect('/chat')
})

// Handle all 404 responses
app.use(function (req, res, next) {
  res.status(404).send("Sorry. We couldn't find that page.")
})

// Handle errors
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Chat app is listening at http://localhost:${port}`)
})