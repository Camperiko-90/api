'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/rclementedb', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('The DB connection success and its okay');

        app.listen(port, function() {
            console.log("Server of Ruben's API REST is listening con http://localhost:" + port);
        });
    }
});