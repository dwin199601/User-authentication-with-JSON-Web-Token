//HERE WE HAVE ALL FUNCTIONS FOR ROUTE FILE
const User = require('../models/User')
const jwt = require('jsonwebtoken');
//handle errors
const handleError = (error) => {
    console.log(error.message, error.code);
    let err = {firstName: '', email: '', password: ''};

    //duplicate error code
    if (error.code === 11000) {
        err.email =  'this email is already in system!'
        return err;
    }
    // incorrect email while login
    if(error.message === 'Incorrect Email!') {
        err.email = 'the email is not registered!';
    }

    // incorrect password while login
    if(error.message === 'Incorrect password!') {
        err.password = 'the password is incorrect!';
    }

    //validation errors
    if(error.message.includes('user validation failed'))
    {
       Object.values(error.errors).forEach(({properties}) => {//distructuring error properties
        err[properties.path] = properties.message;
       }); //errors is object that includes info about error
    }
    return err; //we will display updated err object that includes error message
}

// function for webtoken that is used to login user automatically after registration
const maxAge = 3*24*60*60; //3 days time
const createToken = (id) => {
    return jwt.sign({id}, 'net alex secret', {
        expiresIn: maxAge //how long this jwt will be valid (its just like for cookie)
    }); // id- payload, second is basically signature
}

module.exports.signup_get = (req, res) => {//Here we are rendering views
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { fullName, email, password } = req.body;
    //create new user in DB with our User model schema
    try 
    {
        const user = await User.create({fullName, email, password}); //promise to store user data into the DB
        const token = createToken(user._id); // to login user after registration by using JSON WEB TOKEN function
        res.cookie('responsejwtcookie', token, {httpOnly: true, maxAge: maxAge * 1000}); 
        res.status(201).json({user: user._id}); //201 means successfully created user
    }
    catch(error)
    {
        const err = handleError(error); // to handle errors
        res.status(400).json({err})
    }
}

module.exports.login_post = async (req, res) => {
    //console.log(req.body);
    const { email, password } = req.body;
   
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id); 
        res.cookie('responsejwtcookie', token, {httpOnly: true, maxAge: maxAge * 1000}); 
        res.status(201).json({user: user._id})
    }
    catch(err)
    {
        const errors = handleError(err);
         //if error during the login
        res.status(400).json({errors});

    }

}

module.exports.logout_get = (req, res) => {
    res.cookie('responsejwtcookie', '', {maxAge: 1}); // we moving tokens here. basically we are deleting token
    res.redirect('/');
}