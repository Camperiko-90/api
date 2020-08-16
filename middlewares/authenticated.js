'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_key';

exports.ensureAuth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({message: 'Request without authentication header'})
    }

    var token = req.headers.authorization.replace(/['"]+/g, ''); // Por si el token viene con comillas por delante y/o detrás

    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({message: 'Token expired'})
        }
    } catch(ex) {
        return res.status(404).send({message: 'Token not valid'})
    }

    req.user = payload;
    next();
};