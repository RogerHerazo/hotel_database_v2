module.exports = (app) => {
    const hotels = require('./controller.js');

    // Create a new Note
    app.post('/hotels', hotels.create);

    // Retrieve all Notes
    app.get('/hotels', hotels.findAll);

    // Retrieve a single Note with noteId
    app.get('/hotelFilter', hotels.findOne);

    // Update a Note with noteId
    app.put('/hotelUpdate', hotels.update);

    // Delete a Note with noteId
    app.delete('/hotels', hotels.deleteById);

    //Delete all hotels
    app.delete('/hotelDelete', hotels.deleteAll);

    //Find latitude and longitude all hotels
    app.get('/hotelLatLong', hotels.findLatLong);

    //Find latitude and longitude all hotels
    app.get('/hotelAvailable', hotels.findAvailability);
}