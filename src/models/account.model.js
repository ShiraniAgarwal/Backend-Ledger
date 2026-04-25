const mongoose = require('mongoose'); // Import the mongoose library for defining schemas and interacting with MongoDB

const accountSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Define the user field as an ObjectId that references the User model. This creates a relationship between the Account and User models, allowing us to associate each account with a specific user.
        ref: 'user', // Specify that the ObjectId in the user field references the 'User' model. This allows us to populate the user field with user data when querying accounts.
        required: [true," Account must be associated with a user"], // Make the user field required, meaning that an account cannot be created without associating it with a user.
        index: true // Add an index to the user field to optimize queries that filter or sort by this field. This can improve performance when retrieving accounts based on the associated user.
    },
    status: {
        type: String,
            enum:{
                values:["ACTIVE", "FROZEN", "CLOSED"], 
                message: "Status must be either ACTIVE, FROZEN or CLOSED", // Define an enum for the status field, allowing only specific values (ACTIVE, FROZEN, CLOSED) and providing a custom error message if an invalid value is provided.
            }, 
                default: "ACTIVE" // Set the default value of the status field to "ACTIVE" if no value is provided when creating an account. This means that if the client does not specify a status, it will automatically be set to ACTIVE.

        },
    currency:{
        type: String,
        required: [true,"Currency is required for creating an account"], // Make the currency field required, meaning that an account cannot be created without specifying a currency.
        default: "INR" // Set the default value of the currency field to "INR" (Indian Rupee) if no value is provided when creating an account.
    }
},
    {
        timestamps: true // Automatically add createdAt and updatedAt fields to the schema, which will store the date and time when an account document is created and last updated. This is useful for tracking when accounts are created and modified.
    }
);

accountSchema.index({ user: 1, status: 1 }); // Create an index on the user field to optimize queries that filter or sort by this field. This can improve performance when retrieving accounts based on the associated user.

const accountModel = mongoose.model('Account', accountSchema); // Create a Mongoose model named 'Account' using the defined accountSchema. This model will be used to interact with the 'accounts' collection in the MongoDB database, allowing us to perform CRUD operations on account documents.
module.exports = accountModel; // Export the accountModel so that it can be imported and used in other parts of the application, such as in route handlers or controllers where we need to create, read, update, or delete account data.
