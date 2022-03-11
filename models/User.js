const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
//Creating schema - says how objects are going to look inside the db
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please enter full name']
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true, //email must be unique, we use err.code for that inside of authController
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [6, 'Minimum password length is 6 character'] //second parameter is fpr error message
    }
});

// fire a function after new user was saved to db
userSchema.post('save', function (doc, next){ //post means AFTER
    //it refers to something that happen after creating new user
    console.log("new user was created!!", doc);
    next(); // we must do it in the end of any midleware or hook, otherwise this function will be on hold (means it won't be finished)
});

//fire a function before doc saved to DB
userSchema.pre('save', async function (next)  { //pre means before user is saved to db
   const salt = await bcrypt.genSalt(); //salt is just string characters
   this.password = await bcrypt.hash(this.password, salt);
   //this - referce to the user that we are trying to create
   next();
})
//static method to login user
userSchema.statics.login = async function (email, password) { //login is just a name for statics, it can be anything
    const user = await this.findOne({email: email}); //if it finds user with this email inside of db, it will place that user 
    //inside of const user
    //if we have user with this email in db
    if (user) {
        //we need to compare hashed passwords
        const auth = await bcrypt.compare(password, user.password); //it will hash password and after will compare them
        if(auth) {
            return user; //means that user can be logged in
        }
        throw Error ('Incorrect password!');
    }
    throw Error ('Incorrect Email!');
}
//creating model based on the schema
const User = mongoose.model('user', userSchema); //first parameter - just name and the second Schema

module.exports = User; //now we can use this model inside of controller (if we need to save or retrive data)
