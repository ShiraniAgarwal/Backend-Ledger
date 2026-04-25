const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing


const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true,"Email is required for creating an account"],
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
         unique: [ true, "Email already exists." ]
    },
    name:{
        type: String,
        required: [true,"Name is required for creating an account"]
    },
    password:{
        type: String,
        required: [true,"Password is required for creating an account"],       
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Exclude password from query results by default : hide this field by default : Don’t show this field when fetching data from database : when we fetch user data from database, password field will not be included in the result unless we explicitly ask for it. This is a security measure to prevent accidental exposure of sensitive information.
    }
},{
    timestamps: true // Automatically add createdAt and updatedAt fields to the schema, which will store the date and time when a document is created and last updated. This is useful for tracking when user accounts are created and modified.
});

userSchema.pre('save', async function(){
    if(!this.isModified('password')){ // Check if the password field has been modified. If it hasn’t been modified, we can skip the hashing process and move on to the next middleware or save operation.
        return;
    }
    const hash = await bcrypt.hash(this.password, 10); // Hash the password using bcryptjs with a salt round of 10. This will generate a secure hash of the password that can be stored in the database instead of the plain text password.
    this.password = hash; // Replace the plain text password with the hashed version before saving it to the database.
    return ;
});
userSchema.methods.comparePassword = async function(password){
    console.log(password, this.password); // Log the provided password and the stored hashed password for debugging purposes. This can help us verify that the correct values are being compared when checking the password during login.
    return await bcrypt.compare(password, this.password); // Compare the provided password with the hashed password stored in the database. This method will return true if the passwords match and false if they don’t.
}
 
const userModel = mongoose.model('User', userSchema); // Create a Mongoose model named 'User' using the defined userSchema. This model will be used to interact with the 'users' collection in the MongoDB database, allowing us to perform CRUD operations on user documents.
module.exports = userModel; // Export the userModel so that it can be imported and used in other parts of the application, such as in route handlers or controllers where we need to create, read, update, or delete user data.