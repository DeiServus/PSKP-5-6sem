const express = require('express');
const session = require('express-session');
var bodyParser = require('body-parser')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const users = require('./users.json');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

passport.use(new LocalStrategy((username, password, done) => {
	const user = users.find(u => u.username === username && u.password === password);
	if (user) {
		return done(null, user);
	} else {
		return done(null, false, { message: 'Wrong login or password' });
	}
}));

passport.serializeUser((login, done) => {
	done(null, login);
});

passport.deserializeUser((login, done) => {
	done(null, login);
});

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/login.html');
});

app.post('/login', passport.authenticate('local', 
		{ session: true, successRedirect: '/resource', failureRedirect: '/login' }), 
		(req, res) => {
});

app.get('/logout', (req, res) => {
	req.logout(() => {
		res.send('Logout success');
	});
});

app.get('/resource', (req, res, next) => {
	if (req.session.passport && req.session.passport.user) {
		res.send('Resource: ' + req.session.passport.user.username);
	} else {
		res.send('Unauthorized');
	}
});

app.use((req, res) => {
	res.status(404).send('Not found');
});

app.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});