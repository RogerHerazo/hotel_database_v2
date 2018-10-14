module.exports = (app) => {
    const users = require('./controller.js');

    // Create a new Note
    app.post('/users', users.create);

    // Retrieve all Notes
    app.get('/users', users.findAll);

    // Retrieve a single Note with noteId
    app.get('/usersFilter', users.findOne);

    // Update a Note with noteId
    app.put('/users', users.update);

    // Delete a Note with noteId
    app.delete('/users/:userId', users.deleteById);

    //Delete all users
    app.delete('/userDelete', users.deleteAll);
}