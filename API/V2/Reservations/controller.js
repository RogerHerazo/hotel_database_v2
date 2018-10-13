const Reservation = require('./model.js');
function isValidUser(user_id){
    console.log("Verify user_id...")
    return true;
}

function isValidHotel(hotel_id){
    console.log("Verify hotel_id...")
    return true;
}

function isValidDates(start, end){
    console.log("Verify dates...")
    return true;
}

function isAvailable(start, end, rooms){
    console.log("Verify availability...")
    return true;
}

function isValidReservation(reservation){
    console.log(reservation.hotel_id.toString().trim());
    if(reservation.hotel_id && reservation.hotel_id.toString().trim() !== '' &&
       reservation.user_id && reservation.user_id.toString().trim() !== '' &&
       reservation.start && reservation.start.toString().trim() !== '' &&
       reservation.end && reservation.end.toString().trim() !== '' &&
       reservation.rooms && reservation.rooms.toString().trim() !== ''){
            //Verifico si el user es Valido
            if(isValidUser(reservation.user_id.toString())){
                if(isValidHotel(reservation.hotel_id.toString())){
                    if(isValidDates(reservation.start.toString(), reservation.end.toString())){
                        if(isAvailable(reservation.start.toString(), reservation.end.toString(), reservation.rooms.toString())){
                            return respond = {
                                status: '400',
                                message: 'All Good'
                            }
                        }else{
                            //No available rooms
                            return respond = {
                                status: '401',
                                message: 'No Available Rooms'
                            }
                        }
                    }else{
                        return respond = {
                            status: '402',
                            message: 'Not Valid Start or End Date'
                        }
                    }
                }else{
                    //no es un hotel valido
                    return respond = {
                        status: '403',
                        message: 'Not valid HotelID'
                    }
                }
            }else{
                //No es un usuario valido
                return respond = {
                    status: '404',
                    message: 'Not valid UserID'
                }
            }
    }else{
        //Hay CamposVacios
        return respond = {
            status: '405',
            message: 'You missed fields'
        }
    }
}

// Create and Save a new Reservation
exports.create = (req, res) => {
    // Validate request
    if(isValidReservation(req.body).status === "400") {
        res.status(respond.status);
        // Create a Reservation
        const reservation = new Reservation({
            HOTEL_ID: req.body.hotel_id.toString(),
            USER_ID: req.body.user_id.toString(),
            START: req.body.start.toString(),
            END: req.body.end.toString(),
            ROOMS: req.body.rooms.toString()
        });
    
        // Save Reservation in the database
        reservation.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Reservation."
            });
        });
    }else{
        res.status(respond.status);
        res.json(respond.message);
    }
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    Reservation.find()
    .then(reservations => {
        res.send(reservations);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving reservations."
        });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    Reservation.find(req.query)
    .then(reservation => {
        if(!reservation) {
            return res.status(404).send({
                message: "Reservation not found with id " + req.query.reservationId
            });            
        }
        res.send(reservation);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Reservation not found with id " + req.query.reservationId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Reservation with id " + req.query.reservationId
        });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteById = (req, res) => {
    Reservation.findByIdAndRemove(req.params.reservationId)
    .then(reservation => {
        if(!reservation) {
            return res.status(404).send({
                message: "Reservation not found with id " + req.params.reservationId
            });
        }
        res.send({message: "Reservation deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Reservation not found with id " + req.params.reservationId
            });                
        }
        return res.status(500).send({
            message: "Could not delete Reservation with id " + req.params.reservationId
        });
    });
};

exports.deleteAll = (req, res) => {
    Reservation.remove({})
    .catch(err => {
        console.log(err);
        return res.status(500).send({
            message: "Could not delete reservation db "
        });
    });
    res.json({
        message: 'Deleted'
    });
};