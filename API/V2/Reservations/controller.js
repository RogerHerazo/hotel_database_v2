const Reservation = require('./model.js');
const Hotel = require('../Hotels/controller.js');
const User = require('../Users/controller.js');
function isValidUser(user_id){
    //Change
    console.log("Verify user_id...")
    return true;
}

function isValidHotel(hotel_id){
    console.log("Verify hotel_id...")
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
    if(reservation.hotel_id && reservation.hotel_id.toString().trim() !== '' &&
       reservation.user_id && reservation.user_id.toString().trim() !== '' &&
       reservation.start && reservation.start.toString().trim() !== '' &&
       reservation.end && reservation.end.toString().trim() !== '' &&
       reservation.rooms && reservation.rooms.toString().trim() !== ''){
            //Verifico si el hotel es Valido
            /*
            ht.findById(hotel_id, function (err, res){
                if(res != null){
                    console.log("Hotel_id is valid");
                }else{
                    console.log("Hotel_id isn't valid");
                }
            });
            */
    }else{
        //Hay CamposVacios
        return respond = {
            status: '405',
            message: 'You missed fields'
        }
    }

    /*
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
    */
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
                                            totalocupied = totalocupied + parseInt(req.body.rooms);
                                            console.log(totalocupied);
                                        }
                                    }
                                }

                                res.status(300);
                                res.json("OK");
                            }).catch(err => {
                                console.log(err) ;
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
                console.log("Hotel not found");
            });
        /*
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
        */
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