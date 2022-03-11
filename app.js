const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const app = express();
const cookieParser = require('cookie-parser'); //middleware
const { requireAuthentification, checkUser } = require('./middleware/authMiddleware');

// middleware
app.use(express.static('public')); //we need it to server static files like css
app.use(express.json()); //midleware, it takes any json that comes with request and passess it into javaScript object
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const PORT = process.env.PORT || 3000;
const dbURI =
 'YOUR MONGODB URL';
mongoose.connect(dbURI, 
{ 
  useNewUrlParser: true, 
  useUnifiedTopology: 
  true, useCreateIndex:true 
})
  .then((result) => app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);}))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser); // means apply to every routs
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuthentification, (req, res) => res.render('smoothies'));
//requireAuthentification is used to check if user is authentificated, if not, we don't show smothies page
app.use(authRoutes);//adding all routes 
