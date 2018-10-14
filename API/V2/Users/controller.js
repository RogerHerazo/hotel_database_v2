const User = require('./model.js');

function isValidUser(user) {
    return user.name && user.name.toString().trim() !== '' &&
        user.lastname && user.lastname.toString().trim() !== '' &&
        user.email && user.email.toString().trim() !== '' &&
        user.password && user.password.toString().trim() !== '' &&
        user.address && user.address.toString().trim() !== '';
}

function isValidUpdateUser(user) {
    return user._id && user._id.toString().trim() !== '' &&
        user.password && user.password.toString().trim() !== '' &&
        user.address && user.address.toString().trim() !== '' &&
        user.newname && user.newname.toString().trim() !== '' &&
        user.newemail && user.newemail.toString().trim() !== '' &&
        user.newpassword && user.newpassword.toString().trim() !== '' &&
        user.newlastname && user.newlastname.toString().trim() !== '' &&
        user.newaddress && user.newaddress.toString().trim() !== '';
}
exports.getDB = () =>{
    return User;
}

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!isValidUser(req.body)) {
        return res.status(400).send({
            message: "Autentication/New fields can not be empty"
        });
    }

    // Create a Note

    const user = new User({
        NAME: req.body.name.toString(),
        LASTNAME: req.body.lastname.toString(),
        EMAIL: req.body.email.toString(),
        PASSWORD: req.body.password.toString(),
        ADDRESS: req.body.address.toString()
    });

    // Save User in the database
    user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while updating the User."
            });
        });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    User.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    User.find(req.query)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.query.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.query.userId
                });
            }
            return res.status(500).send({
                message: "Error retrieving User with id " + req.query.userId
            });
        });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    if (!isValidUpdateUser(req.body)) {
        return res.status(400).send({
            message: "User fields can not be empty"
        });
    }

    const updateuser = new User({
        NAME: req.body.newname.toString(),
        LASTNAME: req.body.newlastname.toString(),
        EMAIL: req.body.newemail.toString(),
        PASSWORD: req.body.newpassword.toString(),
        ADDRESS: req.body.newaddress.toString()
    });

    // Update User in the database
    var query = {
        _id: req.body._id.toString(),
        PASSWORD: req.body.password.toString(),
        ADDRESS: req.body.address.toString()
    }

    User.find(query)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id1 " + req.query.userId
                });
            }

            User.update({NAME: updateuser.NAME, LASTNAME: updateuser.LASTNAME, EMAIL: updateuser.EMAIL, PASSWORD: updateuser.PASSWORD, ADDRESS: updateuser.ADDRESS})
                .then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the User."
                    });
                });
        });
};

// Delete a note with the specified noteId in the request
exports.deleteById = (req, res) => {
    User.findByIdAndRemove(req.params.noteId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send({ message: "User deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.params.userId
            });
        });
};

exports.deleteAll = (req, res) => {
    User.remove({})
        .catch(err => {
            console.log(err);
            return res.status(500).send({
                message: "Could not delete user db "
            });
        });
    res.json({
        message: 'Deleted'
    });
};
