const express = require('express');
const session = require('express-session');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const users = require('./users.json');

const app = express();
const port = 3000;

passport.use(new BasicStrategy(
	function (username, password, done) {
		const user = users.find(u => u.username === username && u.password === password);
		if (user) {
			return done(null, user);
		} else {
			return done(null, false);
		}
	}
));

passport.serializeUser(function (user, done) {
	done(null, user);							//куда отправляет сервер?
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

app.use(session({
	secret: 'secret', //секрет для чего?
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', passport.authenticate('basic', { session: true }), (req, res) => {
	req.session.authenticated = true; //authenticated?
	res.send('Login success');
});

app.get('/logout', (req, res) => {
	req.session.authenticated = false;
	delete req.headers['authorization'];
	res.send('Logout success');
});

app.get('/resource', (req, res, next) => {
	if (req.session.authenticated) {
		res.send('Resource');
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