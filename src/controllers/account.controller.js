const accountModel = require('../models/account.model'); // Import the accountModel from the account.model.js file in the models directory. This model will be used to interact with the accounts collection in the MongoDB database, allowing us to perform CRUD operations on account documents.

/**
 * create account using user id from the auth middleware
 * and return the created account in the response
 * POST /api/accounts/
 * Protected route, requires authentication
 */

async function createAccountController(req, res){
    const userId = req.user; // Extract the user ID from the authenticated user's information, which is attached to the request object (req.user) by the authentication middleware. This assumes that the user has been authenticated and their information is available in req.user.
    const account = await accountModel.create({
        user: userId // Create a new account document in the database using the Account model's create method. The user field of the account is set to the extracted user ID, which associates the account with the authenticated user.
    }); // This will save the new account with the associated user ID in the accounts collection in MongoDB.

    res.status(201).json({
        account // Return a 201 Created response with a JSON object containing the newly created account document. This allows the client to receive the details of the created account, including its ID and associated user information.
    });
}

async function getUserAccountsController(req, res) {

    const accounts = await accountModel.find({ user: req.user._id });

    res.status(200).json({
        accounts
    })
}


