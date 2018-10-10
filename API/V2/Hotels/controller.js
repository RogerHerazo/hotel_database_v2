const Hotel = require('./model.js');

function isValidHotel(hotel){
    return hotel.name && hotel.name.toString().trim() !== '' &&
           hotel.address && hotel.address.toString().trim() !== '' &&
           hotel.state && hotel.state.toString().trim() !== '' &&
           hotel.phone && hotel.phone.toString().trim() !== '' &&
           hotel.fax && hotel.fax.toString().trim() !== '' &&
           hotel.email_id && hotel.email_id.toString().trim() !== '' &&
           hotel.website && hotel.website.toString().trim() !== '' &&
           hotel.type && hotel.type.toString().trim() !== '' &&
           hotel.rooms && hotel.rooms.toString().trim() !== '';
}

// Create and Save a new Hotel
exports.create = (req, res) => {
    // Validate request
    if(!isValidHotel(req.body)) {
        return res.status(400).send({
            message: "Hotel fields can not be empty"
        });
    }

    // Create a Note
    const hotel = new Hotel({
        NAME: req.body.name.toString(),
        ADDRESS: req.body.address.toString(),
        STATE: req.body.state.toString(),
        PHONE: req.body.phone.toString(),
        FAX: req.body.fax.toString(),
        EMAIL_ID: req.body.email_id.toString(),
        WEBSITE: req.body.website.toString(),
        TYPE: req.body.type.toString(),
        ROOMS: req.body.rooms.toString()
    });

    // Save Hotel in the database
    hotel.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Hotel."
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    Hotel.find()
    .then(hotels => {
        res.send(hotels);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving hotels."
        });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    Hotel.find(req.query)
    .then(hotel => {
        if(!hotel) {
            return res.status(404).send({
                message: "Hotel not found with id " + req.query.hotelId
            });            
        }
        res.send(hotel);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Hotel not found with id " + req.query.hotelId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Hotel with id " + req.query.hotelId
        });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteById = (req, res) => {
    Hotel.findByIdAndRemove(req.params.noteId)
    .then(hotel => {
        if(!hotel) {
            return res.status(404).send({
                message: "Hotel not found with id " + req.params.hotelId
            });
        }
        res.send({message: "Hotel deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Hotel not found with id " + req.params.hotelId
            });                
        }
        return res.status(500).send({
            message: "Could not delete hotel with id " + req.params.hotelId
        });
    });
};

exports.deleteAll = (req, res) => {
    Hotel.remove({})
    .catch(err => {
        console.log(err);
        return res.status(500).send({
            message: "Could not delete hotel db "
        });
    });
    res.json({
        message: 'Deleted'
    });
};