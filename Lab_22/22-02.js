const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DigestStrategy = require('passport-http').DigestStrategy;
const users = require('./users.json');

const app = express();
const port = 3000;

passport.use(new DigestStrategy({ qop: 'auth' }, (login, done) => {
	const user = users.find(u => u.username === login);
	if (user) {
		return done(null, login, user.password);//где проверяется пароль?
	}
	return done(null, false);
}, (params, done) => {
	done(null, true);
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

app.get('/login', passport.authenticate('digest', { session: true }), (req, res) => {
	req.session.authenticated = true;
	res.send('Login success');
});

app.get('/logout', (req, res) => {
	req.session.authenticated = false;
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