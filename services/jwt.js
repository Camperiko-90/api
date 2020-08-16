'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'you_sould_change_this_passphrase';

exports.createToken = function(user) {
    var payload = {
        sub: user._id, // id documento bbdd (usuario)
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), // Fecha creacion del token en timestamp
        exp: moment().add(30, 'days').unix(), // Fecha de expiracion del token 
    };

    return jwt.encode(payload, secret)
};