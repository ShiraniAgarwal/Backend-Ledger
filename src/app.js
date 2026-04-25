// this file will create instance of express server and export it to be used in other files
//  second it will config the servver to use body parser and cors middlewares (means how many types of api's we are goind to have and which middleware we are using )
const express = require('express'); // require express module or package
const cookieParser = require('cookie-parser'); // require cookie-parser package to parse cookies in incoming requests. This will allow us to access and manipulate cookies sent by the client in our route handlers or controllers.


const app = express(); // create an instance of express server all the server instances will save in app variable

// server will not start here we will export this app variable to other files and start the server there
app.use(express.json()); // use the express.json() middleware to parse incoming JSON payloads in the request body. This allows us to access the data sent by the client in a structured format when handling requests in our route handlers or controllers.
app.use(cookieParser()); // use the cookie-parser middleware to parse cookies in incoming requests. This will allow us to access and manipulate cookies sent by the client in our route handlers or controllers. By adding this middleware, we can easily work with cookies in our application, such as setting, reading, and deleting cookies as needed for authentication or other purposes.

/**
 * Routes required for accounts and auth
 * we will use these routes in our server.js file to handle the requests coming to these endpoints
 */

const authRoutes = require('./routes/auth.routes'); // import the auth routes from the auth.routes.js file in the routes directory
const accountRoutes = require('./routes/accounts.routes'); // import the account routes from the accounts.routes.js file in the routes directory
 
/**
 * Use routes
 * we will use these routes for any request that starts with /auth and /accounts
 */
app.use('/api/auth', authRoutes); // use the auth routes for any request that starts with /auth
app.use("/api/accounts", accountRoutes); // use the account routes for any request that starts with /accounts

module.exports = app; // export the app variable to be used in other files in server.js file we will import this app variable and start the server there