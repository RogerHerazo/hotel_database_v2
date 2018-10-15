const mongoose = require('mongoose');

const KeySchema = mongoose.Schema({
    NAME: String,
    COMPANY: String,
    EMAIL: String,
});

module.exports = mongoose.model('Key', KeySchema);