const Reservation = require('./model.js');
const Hotel = require('../Hotels/controller.js');
const User = require('../Users/controller.js');

exports.getDB = () =>{
    return Reservation;
}

// Create and Save a new Reservation
exports.create = (req, res) => {
    let ht = Hotel.getDB();
    let us = User.getDB();
    // Validate request
    if( req.body.hotel_id && req.body.hotel_id.toString().trim() !== '' &&
        req.body.user_id && req.body.user_id.toString().trim() !== '' &&
        req.body.start && req.body.start.toString().trim() !== '' &&
        req.body.end && req.body.end.toString().trim() !== '' &&
        req.body.rooms && req.body.rooms.toString().trim() !== ''){ 
        
            ht.findById(req.body.hotel_id.toString())
            .then(hotel => {
                if(!hotel) {
                    res.status(403);
                    res.json("Not Valid hotel");           
                }else{
                    console.log("Valid hotel");

                    //Verifico al Usuario
                    us.findById(req.body.user_id.toString())
                    .then(user => {
                        if(!user) {
                            res.status(404);
                            res.json("Not Valid user");           
                        }else{
                            console.log("Valid user");

                            //Verify valid reservaton
                            //Formato de fecha DD/MM/AA
                            Reservation.find()
                            .then(reservations => {
                                //console.log(reservations);
                                let currentstart = req.body.start.split('/');
                                let currentend = req.body.end.split('/');
                                let totalocupied = 0;
                                for(let reservation of reservations){
                                    console.log(reservation.START + " - "+ reservation.END);
                                    let prevstart = reservation.START.split('/');
                                    let prevend = reservation.END.split('/');
                                    if( prevstart[0] < currentstart[0] && 
                                        prevstart[0] < currentend[0] && 
                                        prevend[0] < currentstart[0] && 
                                        prevend[0] < currentend[0]){
                                            console.log("130 - "+"Esta reservacion NO interfiere con la actual");
                                    }else{
                                        if( prevstart[0] > currentstart[0] && 
                                            prevstart[0] > currentend[0] && 
                                            prevend[0] > currentstart[0] && 
                                            prevend[0] > currentend[0]){
                                                console.log("136 - "+"Esta Reservacion NO interfiere con la actual");
                                        }else{
                                            console.log("138 - "+"Esta reservacion interfiere con la actual");
                                            totalocupied = totalocupied + parseInt(reservation.ROOMS);
                                            console.log(totalocupied);
                                        }
                                    }
                                }

                                if (hotel.ROOMS - totalocupied < req.body.rooms){
                                    res.status(400);
                                    res.json("No Availalble Rooms");
                                }else{
                                    // Create a Reservation
                                    console.log("Create Reservation");
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
                                }

                            }).catch(err => {
                                res.status(500).send({
                                    message: err.message || "Some error occurred while looking for the hotel."
                                });
                            });


                        }
                    }).catch(err => {
                        console.log(err.kind);
                        if(err.kind === 'ObjectId') {
                            console.log("User not found");                
                        }
                        console.log("User not found");
                    });


                }
            }).catch(err => {
                console.log(err.kind);
                if(err.kind === 'ObjectId') {
                    console.log("Hotel not found");                
                }
                res.status(403);
                res.json("Hotel not found");
            });
    }else{
        res.status(405);
        res.json("You missed Fields");
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