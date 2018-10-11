const mongoose = require('mongoose');

const ReservationSchema = mongoose.Schema({
    HOTEL_ID: String,
    USER_ID: String,
    START: String,
    END: String,
    ROOMS: String
});

module.exports = mongoose.model('Reservation', ReservationSchema);