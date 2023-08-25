const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/SocialNetworkDB');

module.exports = mongoose.connection;