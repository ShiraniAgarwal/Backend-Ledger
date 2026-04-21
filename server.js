require('dotenv').config(); // load environment variables from .env file
const app = require('./src/app'); // import the app variable from src/app.js file
// big companies like google, facebook, etc use the require function intsead of using import, import and export is used by the new companies which are new. 
const connectToDB = require('./src/config/db'); // import the connectToDB function from config/db.js file

connectToDB(); // call the connectToDB function to connect to the database


app.listen(3000, () => { // start the server on port 3000 and listen for incoming requests
    console.log('Server is running on port 3000'); // log a message to the console when the server is started
});