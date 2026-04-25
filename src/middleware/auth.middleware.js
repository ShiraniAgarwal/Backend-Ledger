const userModel = require('../models/user.model'); // Import the userModel from the user.model.js file in the models directory. This model will be used to interact with the users collection in the MongoDB database, allowing us to perform CRUD operations on user documents.
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken package for generating and verifying JSON Web Tokens (JWTs) for authentication purposes. This will allow us to create tokens that can be used to authenticate users and protect certain routes in our application.
/*
This authMiddleware function is used to protect routes by checking 
if the user is logged in or not. It first tries to get a token (JWT) 
from either cookies or the request headers. If no token is found, it 
immediately sends a 401 Unauthorized response. If a token is present, 
it verifies the token using a secret key. After successful verification, 
it extracts the userId from the token and fetches the user from the database. 
Then it attaches that user data to req.user so it can be used later in the 
request. Finally, it calls next() to continue the request. If the token is 
invalid or expired, it again returns a 401 Unauthorized response.

*/
async function authMiddleware(req, res, next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Extract the token from the cookies in the incoming request. This assumes that the client is sending a cookie named "token" that contains the JWT for authentication.

    if(!token){
        return res.status(401).json({
           message: "Unauthorized access, token is missing"
        }); // If the token is not found in the cookies, return a 401 Unauthorized response with a JSON object indicating that the authentication failed and providing a message that the token was not found.
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the jwt.verify() method. This will decode the token and validate its signature using the secret key defined in the environment variables (process.env.JWT_SECRET). If the token is valid, it will return the decoded payload, which typically contains the user's ID and other relevant information.
        // here auth.controller register me userId ko token me daal ke bhej rahe hai, to yaha pe hum us userId ko decode kar ke nikal rahe hai
        const user = await userModel.findById(decoded.userId); // Use the decoded user ID from the token to query the User model and find the corresponding user document in the database. This will allow us to retrieve the user's information based on the token's payload.
        req.user = user; // Attach the retrieved user document to the request object (req.user) so that it can be accessed in subsequent middleware functions or route handlers. This allows us to have access to the authenticated user's information throughout the request lifecycle.
        return next(); // Call the next() function to pass control to the next middleware function or route handler in the Express.js request-response cycle. This allows the request to continue processing after successful authentication.
    } catch(err){
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        }); // If there is an error while verifying the token (e.g., if the token is invalid or expired), return a 401 Unauthorized response with a JSON object indicating that the authentication failed and providing a message that the token is invalid.
    }
}

module.exports = authMiddleware; // Export the authMiddleware function so that it can be imported and used in other parts of the application, such as in route handlers or controllers where we want to protect certain routes and require authentication. This allows us to easily apply the authentication middleware to any route that needs to be protected by simply importing and using this function.