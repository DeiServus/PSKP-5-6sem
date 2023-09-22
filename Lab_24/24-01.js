const express = require('express');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');
const session = require('express-session');
const app = express();

const port = 3000;

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    done(null, id);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: '419561498157-7lpco3b136lgjj2os2etmc7ssjh44qs7.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/auth/google/callback',
        },
        function (accessToken, refreshToken, profile, done) {
            done(null, profile);
        }
    )
);

const isAuth = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.get('/auth/google', passport.authenticate('google', {scope: ['profile']}));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/resource');
    }
);

app.get('/logout', (req, res) => {
    req.logOut(() => {
        res.redirect('/login');
    });
});

app.get('/resource',
    isAuth,
    (req, res) => {
        res.send('Resource\nUserID = ' + req.user);
    }
);

app.use((req, res) => {
    res.status(404).send('Not found');
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});