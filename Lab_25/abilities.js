const {AbilityBuilder} = require('@casl/ability');
const {createPrismaAbility} = require("@casl/prisma");
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const jwt = require('jsonwebtoken');

function defineAbilitiesFor(user) {
    const {can, cannot, build} = new AbilityBuilder(createPrismaAbility);
    const role = user ? user.role : 'guest';
    switch (role) {
        case 'admin':
            can('manage', 'all');
            cannot('create', 'repos');
            break;
        case 'user':
            can('read', 'users', {id: user.id});
            can('create', 'repos');
            can('update', 'repos', {authorId: user.id});
            can('addCommit', 'repos', {authorId: user.id});
            cannot('deleteCommit', 'repos', {authorId: user.id})
            //can('delete', 'repos', {authorId: user.id});
            break;
        default:
            break;
    }
    can('read', 'abilities');
    can('read', 'repos');
    return build();
}

module.exports = async function authorize(req, res, next) {
    console.log(req.user);
    const token = req.cookies['access-token'];
    if (token != null) {
        jwt.verify(token, TOKEN_SECRET, (err, user) => {
            if (!err) req.user = user;
        });
    }
    req.ability = defineAbilitiesFor(req.user);
    next();
}