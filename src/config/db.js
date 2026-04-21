const mongoose = require('mongoose');

//creating a function to connect to the database
function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Server is connected to DB');
        })
        .catch((err) => {
            console.error('Error connecting to DB:', err);
            process.exit(1); // Exit the process with an error code
        });
}

module.exports = connectToDB; // export the connectToDB function to be used in other files