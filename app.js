var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var csrf = require('csurf')
var session = require('client-sessions')
var express = require('express')
var middleware = require('./config/auth-middleware')

var main = require('./routes/main')
var dashboard = require('./routes/dashboard')
var profile = require('./routes/profile')
var auth = require('./routes/auth')

mongoose.connect('mongodb://localhost/arrows')

var app = express()

app.set('views', 'views')
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
	cookieName: 'session',
	secret: '07tLl5BRJtv&SJG9EI*k$@zO',
	duration: 60 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
}))
app.use(csrf())
app.use(middleware.authMiddleware)
app.use(express.static('public'))

// Main
app.get('/', main.view)

// Dashboard
app.get('/dashboard', middleware.requireLogin, dashboard.view), 
app.get('/dashboard/:id', middleware.requireLogin, dashboard.diagram)
app.post('/dashboard/add-diagram', middleware.requireLogin, dashboard.addDiagram)

// Profile
app.get('/profile', profile.view)
app.post('/profile', profile.update)

// Auth
app.get('/register', auth.registerView)
app.post('/register', auth.register)
app.get('/login', auth.loginView)
app.post('/login', auth.login)
app.get('/forgot-password', auth.forgotView)
app.post('/forgot-password', auth.forgot)
app.get('/reset-password/:token', auth.resetView)
app.post('/reset-password/:token', auth.reset)
app.get('/logout', auth.logout)

app.listen(3000)