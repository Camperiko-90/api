'use strict'

var path = require('path');
var fs= require('fs');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function saveUser(req, res) {
    var user = new User();
    var params = req.body;
    console.log(req.body);
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if (params.password) {
        // cifrar contraseña
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null) {
                // save user in bbdd
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({message: 'Error saving user'});
                    } else {
                        if (!userStored) {
                            res.status(404).send({message: 'User not saved'});
                        } else {
                            res.status(200).send({user: userStored});
                        }
                    }
                })
            } else {
                res.status(200).send({message: 'Fill all gaps'});
            }
        });
    } else {
        res.status(200).send({message: 'Password is required'});
    }
}

function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if (err) {
            res.status(500).send({message: 'Error request'});
        } else {
            if (!user) {
                res.status(404).send({message: 'User not found'});
            } else {
                // Comprobar contraseña
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        // Devolvemos datos usuario logeado
                        if(params.gethash) {
                            // Devolvemos token JWT
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({user})
                        }
                    } else {
                        res.status(404).send({message: "User can't log"});
                    }
                });
            }
        }
    })
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error updating user'});
        } else {
            if (!userUpdated) {
                res.status(404).send({message: 'Unable to update user'});
            } else {
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'Imagen no subida...';

    if(req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[file_split.length - 1];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[ext_split.length - 1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
                if (err || !userUpdated) {
                    res.status(500).send({message: 'Error en la petición'});
                } else {
                    if (!userUpdated) {
                        res.status(404).send({message: 'Error actualizando la imagen en BBDD'});
                    } else {
                        res.status(200).send({image: file_name, user: userUpdated});
                    }
                }
            });
        } else {
            res.status(200).send({message: `Extensión del archivo ${file_name} no válida`});
        }
    } else {
        res.status(200).send({message: 'No se ha subido ninguna imagen'});
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var file_path = './uploads/users/' + imageFile;
    fs.exists(file_path, function(exists) {
        if(!exists) {
            res.status(200).send({message: 'No existe la imagen...'});
        } else {
            res.sendFile(path.resolve(file_path));
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};