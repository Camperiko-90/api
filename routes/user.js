'use strict'

var express = require('express');
var multipart = require('connect-multiparty');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_upload = multipart({ uploadDir: './uploads/users' })

api.get('/get-image-user/:imageFile', UserController.getImageFile); // Securizar con el middleware de autenticacion por token
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);

module.exports = api;