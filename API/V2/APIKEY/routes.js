module.exports = (app) => {
    const key = require('./controller.js');

    // Create a new Note
    app.post('/keys', key.create);

    // Retrieve all Notes
    app.get('/keys', key.findAll);
    
    //Delete all API Keys
    app.delete('/keyDelete', key.deleteAll);
}