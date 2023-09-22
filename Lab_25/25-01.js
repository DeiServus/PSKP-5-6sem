const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const redis = require('redis');
const cookieparser = require('cookie-parser')();
const { accessibleBy } = require("@casl/prisma");
const { subject } = require("@casl/ability");
authorize = require('./abilities'),

dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const app = express();
const port = 3000;

app.use(cookieparser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
prisma.$connect();

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
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
    const { username, email, password, role } = req.body;
    try {
        const newUser = await prisma.users.create({ data: { username, email, password, role } });
        const accessToken = generateAccessToken({ id: newUser.id, role });
        const refreshToken = generateRefreshToken({ id: newUser.id, role });
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
        console.log(error);
    }
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username + ' ' + password);
    try {
        const user = await prisma.users.findFirst({
            where: { username, password },
        });
        if (!user) return res.redirect('/login');
        const accessToken = generateAccessToken({ id: user.id, role: user.role });
        const refreshToken = generateRefreshToken({ id: user.id, role: user.role });
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
        console.log(error);
    }
});

app.get('/refresh-token', authenticateRefreshToken, (req, res) => {
    const accessToken = generateAccessToken({ id: req.user.id, role: req.user.role });
    const refreshToken = generateRefreshToken({ id: req.user.id, role: req.user.role });
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
    res.sendStatus(200);
});

app.get('/resource', authenticateToken, async (req, res) => {
    const { id } = req.user;
    try {
        const user = await prisma.users.findFirst({
            where: { id }
        });
        if (!user) return res.sendStatus(404);
        res.send(`RESOURCE<br>User: ${user.id} - ${user.username} - ${user.role}<br>${JSON.stringify(req.user)}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
});

app.get('/api/ability', authorize, (req, res) => {
    res.status(200).send(req.ability.rules);
});

app.get('/api/users', authenticateToken, authorize, async (req, res) => {
    prisma.users.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
        }
    }).then(elements =>
        res.status(200).json(elements)
    ).catch(err => {
        res.status(500).send(err)
    })
});

app.get('/api/users/:id', authenticateToken, authorize, (req, res) => {
    prisma.users.findFirst({
        where: {
            id: parseInt(req.params.id),
            AND: [accessibleBy(req.ability).users],
        },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
        }
    }).then(elements =>
        res.status(200).json(elements)
    ).catch(err => {
        res.status(500).send(err)
    })
})

app.get('/api/repos', authorize, (req, res) => {
    prisma.repos.findMany().then(elements =>
        res.status(200).json(elements)
    ).catch(err => {
        res.status(500).send(err)
    })
})

app.get('/api/repos/:id', authorize, (req, res) => {
    prisma.repos.findFirst({
        where: {
            id: +req.params.id
        }
    }).then(elements =>
        res.status(200).json(elements)
    ).catch(err => {
        res.status(500).send(err)
    })
})

app.post('/api/repos', authenticateToken, authorize, (req, res) => {
    if (req.ability.can('create', 'repos')) {
        prisma.repos.create({ data: { ...req.body, authorId: req.user.id } }).then(element => {
            res.status(201).json(element);
        }).catch(err => {
            res.status(400).json(err);
            console.log(err);
        });
    }
    else {
        res.status(401).json({ error: 'You can\'t create repos' });
    }
})

app.put('/api/repos/:id', authenticateToken, authorize, async (req, res) => {
    const repo = await prisma.repos.findFirst({
        where: {
            id: parseInt(req.params.id)
        }
    });
    if (!repo) {
        res.status(401).json({ error: 'Repo does not exist' });
    }
    else {
        if (req.ability.can('update', subject('repos', { authorId: repo.authorId }))) {
            prisma.repos.update({
                where: { id: parseInt(req.params.id) },
                data: { ...req.body }
            }).then(element => {
                res.status(201).json(element);
            }).catch(err => {
                res.status(400).json(err);
                console.log(err);
            });
        } else {
            res.status(401).json({ error: 'You can\'t update this repos' });
        }
    }
})

app.delete('/api/repos/:id', authenticateToken, authorize, async (req, res) => {
    const repo = await prisma.repos.findFirst({
        where: {
            id: parseInt(req.params.id)
        }
    });
    if (!repo) {
        res.status(401).json({ error: 'Repo does not exist' });
    }
    else {
        if (req.ability.can('delete', subject('repos', { authorId: repo.authorId }))) {
            prisma.repos.delete({
                where: { id: parseInt(req.params.id) }
            }).then(element => {
                res.status(201).json(element);
            }).catch(err => {
                res.status(400).json(err);
                console.log(err);
            });
        } else {
            res.status(401).json({ error: 'You can\'t delete this repos' });
        }
    }
})

app.get('/api/repos/:id/commits', authorize, (req, res) => {
    prisma.repos.findFirst({
        where: {
            id: +req.params.id
        },
        select: {
            commits: true
        }
    }).then(elements =>
        res.status(200).json(elements)
    ).catch(err => {
        res.status(500).send(err)
    })
})

app.get('/api/repos/:id/commits/:commitId', authorize, (req, res) => {
    prisma.commits.findFirst({
        where: {
            id: +req.params.commitId
        }
    }).then(elements =>
        res.status(200).json(elements)
    ).catch(err => {
        res.status(500).send(err)
    })
})

app.post('/api/repos/:id/commits', authenticateToken, authorize, async (req, res) => {
    const repo = await prisma.repos.findFirst({
        where: {
            id: parseInt(req.params.id)
        }
    });
    if (!repo) {
        res.status(401).json({ error: 'Repo does not exist' });
    }
    else {
        if (req.ability.can('addCommit', subject('repos', { authorId: repo.authorId }))) {
            prisma.commits.create({
                data: { repoId: +req.params.id, ...req.body }
            }).then(element => {
                res.status(201).json(element);
            }).catch(err => {
                res.status(400).json(err);
                console.log(err);
            });
        }
        else {
            res.status(401).json({ error: 'You can\'t commit to this repo' });
        }
    }
})

app.put('/api/repos/:id/commits/:commitId', authenticateToken, authorize, async (req, res) => {
    const repo = await prisma.repos.findFirst({
        where: {
            id: parseInt(req.params.id)
        }
    });
    if (!repo) {
        res.status(401).json({ error: 'Repo does not exist' });
    }
    else {
        if (req.ability.can('update', subject('repos', { authorId: repo.authorId }))) {
            prisma.commits.update({
                where: { id: +req.params.commitId },
                data: { repoId: +req.params.id, ...req.body }
            }).then(element => {
                res.status(201).json(element);
            }).catch(err => {
                res.status(400).json(err);
                console.log(err);
            });
        }
        else {
            res.status(401).json({ error: 'You can\'t update commits from this repo' });
        }
    }
})

app.delete('/api/repos/:id/commits/:commitId', authenticateToken, authorize, async (req, res) => {
    const repo = await prisma.repos.findFirst({
        where: {
            id: parseInt(req.params.id)
        }
    });
    if (!repo) {
        res.status(401).json({ error: 'Repo does not exist' });
    }
    else {
        if (req.ability.can('deleteCommit', subject('repos', { authorId: repo.authorId }))) {
            prisma.commits.delete({
                where: { id: +req.params.commitId }
            }).then(element => {
                res.status(201).json(element);
            }).catch(err => {
                res.status(400).json(err);
                console.log(err);
            });
        }
        else {
            res.status(401).json({ error: 'You can\'t delete commits from this repo' });
        }
    }
})

app.use((req, res) => {
    res.sendStatus(404);
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});