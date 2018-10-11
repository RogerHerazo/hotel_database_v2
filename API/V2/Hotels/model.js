const mongoose = require('mongoose');

const HotelSchema = mongoose.Schema({
    NAME: String,
    ADDRESS: String,
    LATITUDE: String,
    LONGITUDE: String,
    STATE: String,
    PHONE: String,
    FAX: String,
    EMAIL_ID: String,
    WEBSITE: String,
    TYPE: String,
    ROOMS: String,
    SIZE: String
});

module.exports = mongoose.model('Hotel', HotelSchema);