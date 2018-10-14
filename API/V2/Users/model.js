const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    NAME: String,
    LASTNAME: String,
    EMAIL: String,
    PASSWORD: String,
    ADDRESS: String
});

module.exports = mongoose.model('User', UserSchema);