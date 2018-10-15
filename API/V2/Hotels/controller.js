const Hotel = require('./model.js');
const Apikey = require('../APIKEY/controller.js');
const Reservation = require('../Reservations/controller.js');
var NodeGeocoder = require('node-geocoder');
var options = {
    provider: 'opencage',
   
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'e8fc54482aa349fcb1396279b54e0526', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  };

var geocoder = NodeGeocoder(options);

function isValidHotel(hotel){
    return hotel.name && hotel.name.toString().trim() !== '' &&
           hotel.address && hotel.address.toString().trim() !== '' &&
           hotel.state && hotel.state.toString().trim() !== '' &&
           hotel.phone && hotel.phone.toString().trim() !== '' &&
           hotel.fax && hotel.fax.toString().trim() !== '' &&
           hotel.email_id && hotel.email_id.toString().trim() !== '' &&
           hotel.website && hotel.website.toString().trim() !== '' &&
           hotel.type && hotel.type.toString().trim() !== '' &&
           hotel.rooms && hotel.rooms.toString().trim() !== '' &&
           hotel.apikey && hotel.apikey.toString().trim() !== '';
}


function isValidUpdateHotel(hotel) {
    return  hotel.phone && hotel.phone.toString().trim() !== '' && 
            hotel.email_id && hotel.email_id.toString().trim() !== '' &&
            hotel.website && hotel.website.toString().trim() !== '' &&
            hotel.type && hotel.type.toString().trim() !== '' &&
            hotel.rooms && hotel.rooms.toString().trim() !== '' &&
            hotel.apikey && hotel.apikey.toString().trim() !== '';    
}

function sizeCategory(rooms){
    if (rooms >= 10 && rooms < 50 ){
        return "Small"
    }
    if (rooms >= 50 && rooms < 100 ){
        return "Medium"
    }
    if (rooms >= 100 ){
        return "Big"
    }
}

exports.getDB = () =>{
    return Hotel;
}

// Create and Save a new Hotel
exports.create = (req, res) => {
let ak = Apikey.getDB();

    // Validate request
    if(!isValidHotel(req.body)) {
        return res.status(400).send({
            message: "Hotel fields can not be empty"
        });
    }

    ak.findById(req.body.apikey)
    .then(key => {
        if(!key) {
            return res.status(404).send({
                message: "Apikey not found"
            });            
        }else{
            console.log("Valid Apikey");
            geocoder.geocode(req.body.address.toString(), function(err, resp) {
                if(resp[0] !== undefined){
                    var lat = resp[0].latitude;
                    var long = resp[0].longitude;
                }else{
                    var lat = "0";
                    var long = "0";
                }
        
                const hotel = new Hotel({
                    NAME: req.body.name.toString(),
                    ADDRESS: req.body.address.toString(),
                    LATITUDE: lat, 
                    LONGITUDE: long,
                    STATE: req.body.state.toString(),
                    PHONE: req.body.phone.toString(),
                    FAX: req.body.fax.toString(),
                    EMAIL_ID: req.body.email_id.toString(),
                    WEBSITE: req.body.website.toString(),
                    TYPE: req.body.type.toString(),
                    ROOMS: req.body.rooms.toString(),
                    SIZE: sizeCategory(req.body.rooms.toString())
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
            });
        }   
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Apikey not found"
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Apikey"
        });
    });

    /*
    // Create a Note
    
    */
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
        console.log(err.kind);
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
    if (!isValidUpdateHotel(req.body)) {
        return res.status(400).send({
            message: "Hotel fields can not be empty"
        });
    }
    console.log("Valid update Hotel");
    Hotel.findById(req.body._id.toString())
        .then(hotel => {
            if (!hotel) {
                return res.status(404).send({
                    message: "Hotel not found"
                });
            }
            console.log("Found hotel")
            Hotel.update({PHONE: req.body.phone.toString(),
                        EMAIL_ID: req.body.email_id.toString(),
                        WEBSITE: req.body.website.toString(),
                        TYPE: req.body.type.toString(),
                        ROOMS: req.body.rooms.toString()})
                .then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while updating the Hotel."
                    });
                });
        });
};

// Delete a note with the specified noteId in the request
exports.deleteById = (req, res) => {
    let ak = Apikey.getDB();
    
    ak.findById(req.query.apikey)
    .then(key => {
        if(!key) {
            return res.status(404).send({
                message: "Apikey not found"
            });            
        }else{
            Hotel.findByIdAndRemove(req.query._id)
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
        }   
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Apikey not found"
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Apikey"
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

exports.findLatLong = (req, res) => {
    Hotel.find()
    .then(hotels => {
        var lat = parseFloat(req.query.lat);
        var long = parseFloat(req.query.long);
        var range = parseFloat(req.query.range);
        var hotelres = [];
        for(let hotel of hotels){
            console.log((lat - range) + " < " + hotel.LATITUDE + " < " + (lat + range));
            console.log((long - range) + " < " + hotel.LONGITUDE + " < " + (long + range));
            if((lat - range) < hotel.LATITUDE && hotel.LATITUDE < (lat + range)){
                if((long - range) < hotel.LONGITUDE && hotel.LONGITUDE < (long + range)){
                    console.log("This hotel is in range");
                    hotelres.push(hotel);
                }
            }
        }
        console.log(hotelres);
        res.send(hotelres);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while looking for the hotel."
        });
    });
};

exports.findAvailability = (req,res) => {
    res.status(403);
    res.json("Available");
}