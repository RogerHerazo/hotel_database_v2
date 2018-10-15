const Key = require('./model.js');

function isValidKey(user) {
    return user.name && user.name.toString().trim() !== '' &&
        user.company && user.company.toString().trim() !== '' &&
        user.email && user.email.toString().trim() !== '';
}

exports.getDB = () =>{
    return Key;
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
        COMPANY: req.body.company.toString(),
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

// Find a single note with a noteID
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