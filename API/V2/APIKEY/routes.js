module.exports = (app) => {
    const key = require('./controller.js');

    // Create a new Note
    app.post('/keys', keys.create);

    // Retrieve all Notes
    app.get('/keys', keys.findAll);

    // Retrieve a single Note with noteId
    app.get('/keys', keys.findOne);

    // Update a Note with noteId
    app.put('/keys', keys.update);

    // Delete a Note with noteId
    app.delete('/keys/:keyId', keys.deleteById);

    //Delete all API Keys
    app.delete('/keyDelete', keys.deleteAll);
}