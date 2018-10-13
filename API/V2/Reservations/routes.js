module.exports = (app) => {
    const reservations = require('./controller.js');

    // Create a new Note
    app.post('/reservations', reservations.create);

    // Retrieve all Notes
    app.get('/reservations', reservations.findAll);

    // Retrieve a single Note with noteId
    app.get('/reservationsFilter', reservations.findOne);

    // Update a Note with noteId
    app.put('/reservationUpdate', reservations.update);

    // Delete a Note with noteId
    app.delete('/reservations/:reservationId', reservations.deleteById);

    //Delete all hotels
    app.delete('/reservationDelete', reservations.deleteAll);
}