var { User } = require('../models/user');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    // console.log('token=', token);

    User.findByToken(token).then((doc) => {
        // console.log('doc en authenticate:', doc);
        if (!doc) {
            return Promise.reject();
        }
        req.user = doc;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    });
};

var hasUserPermission = (req, res, next) => {
    // Si es administrador o está accediendo a su User
    try {
        if (req.user.isAdmin || req.params.id == req.user._id.toHexString()) {
            return next();
        }
    } catch (e) {
        // do nothing
    }
    return res.status(403).send(); // Forbiden
};

module.exports = { authenticate, hasUserPermission };