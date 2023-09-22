const express = require('express');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const redis = require('redis');
const cookieparser = require('cookie-parser')();

const TOKEN_SECRET = 'TOKEN_SECRET';
const app = express();
const port = 3000;

app.use(cookieparser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const sequelize = new Sequelize(
    'lab23', 
    'sa', 
    '1111', 
    {
        host: 'localhost', 
        dialect: 'mssql',
    }
);

class User extends Model { };
User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
},
    {
        sequelize,
        timestamps: false
    }
);

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
});
redisClient.connect();

function generateAccessToken(user) {
    return jwt.sign(user, TOKEN_SECRET, { expiresIn: '10m' });
}

function generateRefreshToken(user) {
    return jwt.sign(user, TOKEN_SECRET, { expiresIn: '24h' });
}

function authenticateToken(req, res, next) {
    const token = req.cookies['access-token'];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(401);
        req.user = user;
        next();
    });
}

function authenticateRefreshToken(req, res, next) {
    const token = req.cookies['refresh-token'];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err || !redisClient.sIsMember('refresh-tokens', token))
            return res.sendStatus(401);
        req.user = user;
        next();
    });
}

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = await User.create({ username, password });
        const accessToken = generateAccessToken({ username });
        const refreshToken = generateRefreshToken({ username });
        redisClient.sAdd('refresh-tokens', refreshToken);
        res.cookie('access-token', accessToken, {
            httpOnly: true,
            sameSite: 'Strict',
        });
        res.cookie('refresh-token', refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
            path: '/refresh-token',
        });
        res.redirect('/resource');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username + ' ' + password);
    try {
        const user = await User.findOne({
            where: { username, password },
        });
        if (!user) return res.redirect('/login');
        const accessToken = generateAccessToken({ username });
        const refreshToken = generateRefreshToken({ username });
        redisClient.sAdd('refresh-tokens', refreshToken);
        res.cookie('access-token', accessToken, {
            httpOnly: true,
            sameSite: 'Strict',
        });
        res.cookie('refresh-token', refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
        });
        res.redirect('/resource');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/refresh-token', authenticateRefreshToken, (req, res) => {
    const { username } = req.user;
    const accessToken = generateAccessToken({ username });
    const refreshToken = generateRefreshToken({ username });
    //if(!req.cookies['refresh-token']) res.redirect('/login');
    redisClient.sRem('refresh-tokens', req.cookies['refresh-token']);
    redisClient.sAdd('refresh-tokens', refreshToken);
    res.cookie('access-token', accessToken, {
        httpOnly: true,
        sameSite: 'Strict',
    });
    res.cookie('refresh-token', refreshToken, {
        httpOnly: true,
        sameSite: 'Strict',
        path: '/refresh-token',
    });
    res.sendStatus(200);
});

app.get('/logout', (req, res) => {
    res.clearCookie('access-token');
    redisClient.sRem('refresh-tokens', req.cookies['refresh-token']);
    res.clearCookie('refresh-token');
    res.sendStatus(200);
});

app.get('/userinfo', authenticateToken, async (req, res) => {
    const { username } = req.user;
    try {
        const user = await User.findOne({
            where: { username },
            attributes: ['id', 'username']
        });
        if (!user) return res.sendStatus(404);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/resource', authenticateToken, async (req, res) => {
    if(!req.user) res.redirect('/login');
    const { username } = req.user;
    try {
        const user = await User.findOne({
            where: { username },
            attributes: ['id', 'username']
        });
        if (!user) return res.sendStatus(404);
        res.send(`RESOURCE<br>User: ${user.id} - ${user.username}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use((req, res) => {
    res.sendStatus(404);
});

app.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});