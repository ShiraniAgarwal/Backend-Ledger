const express = require('express'); // Import the Express framework to create a router for handling account-related routes in the application.
const authMiddleware = require("../middleware/auth.middleware")
const accountController = require('../controllers/account.controller'); // Import the accountController from the account.controller.js file in the controllers directory. This controller will contain the logic for handling account-related operations such as creating an account, fetching accounts, etc.


const router = express.Router(); // Create a new router instance using the Express framework. This router will be used to define routes for handling account-related requests, such as creating an account, fetching accounts, etc.

// /**
//  * - POST /api/accounts/
//  * - Create a new account for the authenticated user
//  * - Protected route, requires authentication
//  */
router.post("/", authMiddleware, accountController.createAccountController)

/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
router.get("/", authMiddleware, accountController.getUserAccountsController);
console.log("authMiddleware:", authMiddleware);
console.log("createAccountController:", accountController.createAccountController);
console.log("getUserAccountsController:", accountController.getUserAccountsController);

module.exports = router;