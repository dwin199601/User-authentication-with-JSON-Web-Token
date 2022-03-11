const jwt = require('jsonwebtoken');
const User = require('../models/User');

// create middleware function
const requireAuthentification = (req, res, next) => {
    const token = req.cookies.responsejwtcookie;

    //check json web token & is verified
    if(token) {
        //we verify token by using verify method
        jwt.verify(token, 'net alex secret', (err, decodedToken) => { // second parameter is a secret key that we use to sign token
            //function that takes error and decodedToken
            if(err) {
                console.log(err.message);
                res.redirect('/login');   
            }
            else 
            {
                console.log(decodedToken);
                next(); // to procide with the next middleware
            }
        }) 
    }
    else {
        res.redirect('/login');
    }    
}
//check current user

const checkUser = (req, res, next) => {
    const token = req.cookies.responsejwtcookie;
    if(token) {
        jwt.verify(token, 'net alex secret', async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.locals.user = null; // we don't want to check view here
                next();
            }
            else 
            {
                console.log(decodedToken);
                //getting info about user, on decodedToken we have payload and payload has id
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next(); // to procide with the next middleware
            }
        });
    }
    else 
    {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuthentification, checkUser};