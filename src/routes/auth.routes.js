const express = require('express');
const authController = require('../controllers/auth.controller'); // Import the authController from the auth.controller.js file in the controllers directory

const router = express.Router();

//api/auth/register : this is api endpoint for user registration
/* POST api/auth/register */
router.post("/register",authController.userRegisterController); // Define a POST route for the /register endpoint that will be handled by the userRegisterController function from the authController. This means that when a client makes a POST request to /api/auth/register, the userRegisterController function will be executed to handle the registration logic.

/* POST api/auth/login */
router.post("/login",authController.userLoginController); // Define a POST route for the /login endpoint that will be handled by the userLoginController function from the authController. This means that when a client makes a POST request to /api/auth/login, the userLoginController function will be executed to handle the login logic.

module.exports = router;