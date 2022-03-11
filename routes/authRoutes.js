const  {Router} = require('express'); //first - we destructure router from express package
const router = Router(); //new instance for route 
const authController = require('../controllers/authController');

/* EXAMPLE
router.get('/signup', () => { 
  //we have a function inside of route but we are not gonna create it in this file, we create auth controller 

});
EXAMPLE END*/

router.get('/signup', authController.signup_get); //WHEN we get get request for signup it will fire signup_get function

router.post('/signup', authController.signup_post);

router.get('/login', authController.login_get);

router.post('/login', authController.login_post);

router.get('/logout', authController.logout_get);

module.exports = router; //export it, so we can import it inside of app.js