const userModel = require('../models/user.model'); // Import the User model from the user.model.js file in the models directory
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken package for generating and verifying JSON Web Tokens (JWTs) for authentication purposes. This will allow us to create tokens that can be used to authenticate users and protect certain routes in our application.
const emailService = require('../services/email.service'); // Import the email service from the email.service.js file in the services directory. This will allow us to use the functions defined in the email service to send emails, such as welcome emails after user registration.
/**
 * -   user register controller
 * -   POST /api/auth/register
*/

async function userRegisterController(req, res){
    const {email, name, password} = req.body; // Extract the email, name, and password from the request body. This assumes that the client is sending a JSON payload with these fields when making a POST request to the /register endpoint.

    const isExist = await userModel.findOne({
        email: email
    }); // Check if a user with the provided email already exists in the database by querying the User model. This will return the user document if it exists or null if it doesn’t.

    if(isExist){
        return res.status(400).json({            
            message: "User already exists with this email",
            status: "failed"
        }); // If a user with the provided email already exists, return a 400 Bad Request response with a JSON object indicating that the registration was unsuccessful and providing a message that the user already exists with this email.
    }
    const user = await userModel.create({
        email,password, name
    }); // If the email is not already in use, create a new user document in the database using the User model’s create method. This will save the new user with the provided email, password, and name.
    // Generate a JSON Web Token (JWT) for the newly registered user using the jwt.sign() method. The payload of the token includes the user’s ID and email, and it is signed with a secret key (process.env.JWT_SECRET) that should be defined in your environment variables for security purposes. The token will be used for authenticating the user in subsequent requests.
    // Set the token to expire in 3 days. This means that the token will be valid for 72 hours after it is issued, and after that, the user will need to log in again to obtain a new token.
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.cookie("token", token); // Set a cookie named "token" with the generated JWT as its value. The cookie will be sent to the client and can be used for authentication in future requests. The options provided include:
    res.status(201).json({
        user:{
            _id: user._id,
            email: user.email,
            name: user.name
        },       
        token
    }); // Return a 201 Created response with a JSON object indicating that the registration was successful, along with a message and the generated token. This allows the client to receive the token immediately after registration, which can be used for authentication in subsequent requests.

    // send welcome email to the user after registration
    // email tab bhejenge jab hum reponse bhej chuke hai
    // recipient email address (the email of the newly registered user)
    // Use the sendEmail function from the email service to send a welcome email to the newly registered user. The function takes the recipient's email address, subject, plain text body, and HTML body as parameters to compose and send the email.
    await emailService.sendRegistrationEmail(user.email, user.name);
}    

/**
 * -   user login controller
 * -   POST /api/auth/login
*/

async function userLoginController(req, res){
    const {email, password} = req.body; // Extract the email and password from the request body. This assumes that the client is sending a JSON payload with these fields when making a POST request to the /login endpoint.
    // will find user based on the email
    const user = await userModel.findOne({ email }).select("+password"); // Query the User model to find a user document with the provided email. The select("+password") part is used to include the password field in the query result, as it is excluded by default in the User schema for security reasons. This will allow us to access the hashed password for comparison later on.

    if(!user){
        return res.status(401).json({
            message: "Email or password is INVALID"
        }); // If no user is found with the provided email, return a 401 Unauthorized response with a JSON object indicating that the login was unsuccessful and providing a message that the email or password is invalid.
    }
    // if user is found then we will compare the password
    const isValidPassword = await user.comparePassword(password); // Use the comparePassword method defined in the User model to compare the provided password with the hashed password stored in the database. This will return true if the passwords match and false if they don’t.

    if(!isValidPassword){
        return res.status(401).json({
            message: "Email or password is INVALID"
        }); // If the provided password does not match the stored password, return a 401 Unauthorized response with a JSON object indicating that the login was unsuccessful and providing a message that the email or password is invalid.
    }
    // if password is valid then we will generate a token for the user
    // Generate a JSON Web Token (JWT) for the authenticated user using the jwt.sign() method. The payload of the token includes the user’s ID and email, and it is signed with a secret key (process.env.JWT_SECRET) that should be defined in your environment variables for security purposes. The token will be used for authenticating the user in subsequent requests.
    // Set the token to expire in 3 days. This means that the token will be valid for 72 hours after it is issued, and after that, the user will need to log in again to obtain a new token.
    const token = jwt.sign({userid: user._id, email: user.email}, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.cookie("token", token) // Set a cookie named "token" with the generated JWT as its value. The cookie will be sent to the client and can be used for authentication in future requests. The options provided include:
    res.status(200).json({
        user:{
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    }); // Return a 201 Created response with a JSON object indicating that the login was successful, along with the user’s information and the generated token. This allows the client to receive the token immediately after logging in, which can be used for authentication in subsequent requests.
}

/* 
 *- When user will register in our application, welcome mail will be send in their email account 
 *- For sending email we will use nodemailer package and we will create a utility function for sending email in utils/email.js file and we will call that function in userRegisterController after creating the user in database

*/
module.exports = {
    userRegisterController, // Export the userRegisterController function so that it can be imported and used in other parts of the application, such as in route handlers where we will define the logic for handling user registration requests.
    userLoginController
}