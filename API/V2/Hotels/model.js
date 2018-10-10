const mongoose = require('mongoose');

const HotelSchema = mongoose.Schema({
    NAME: String,
    ADDRESS: String,
    STATE: String,
    PHONE: String,
    FAX: String,
    EMAIL_ID: String,
    WEBSITE: String,
    TYPE: String,
    ROOMS: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Hotel', HotelSchema);