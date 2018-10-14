const Key = require('./model.js');

function isValidKey(user) {
    return user.name && user.name.toString().trim() !== '' &&
        user.company && user.lastname.toString().trim() !== '' &&
        user.email && user.email.toString().trim() !== '';
}

// Create and Save a new Key
exports.create = (req, res) => {
    // Validate request
    if (!isValidKey(req.body)) {
        return res.status(400).send({
            message: "Key Request fields can not be empty"
        });
    }

    // Create a Note

    const key = new Key({
        NAME: req.body.name.toString(),
        COMPANY: req.body.lastname.toString(),
        EMAIL: req.body.email.toString()
    });

    // Save Key in the database
    key.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Key."
            });
        });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    Key.find()
        .then(keys => {
            res.send(keys);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving keys."
            });
        });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    Key.find(req.query)
        .then(key => {
            if (!key) {
                return res.status(404).send({
                    message: "User not found with id " + req.query.userId
                });
            }
            res.send(key);
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

exports.deleteById = (req, res) => {
    Key.findByIdAndRemove(req.params.noteId)
        .then(key => {
            if (!key) {
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
    Key.remove({})
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