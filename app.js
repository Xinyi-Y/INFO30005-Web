const express = require('express')
const bodyParser = require('body-parser')
//Code block for HTML,CSS,and handlebars
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')


////
const cors = require('cors');
const passport = require('passport');
const session      = require('express-session');
const flash    = require('connect-flash-plus');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config()
require('./config/passport')(passport);
////


const app = express();


////
app.use(cors({
  credentials: true, // add Access-Control-Allow-Credentials to header
  origin: "http://localhost:3000" 
}));


// setup a session store signing the contents using the secret key
app.use(session({ secret: process.env.PASSPORT_KEY,
  resave: true,
  saveUninitialized: true
 }));

//middleware that's required for passport to operate
app.use(passport.initialize());

// middleware to store user object
app.use(passport.session());

// use flash to store messages
app.use(flash());
////


require("./models");


app.engine('hbs', exphbs({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
	defaultlayout: 'main',
	extname: 'hbs',
  helpers: require(__dirname + "/public/js/helper.js").helpers
})) 

app.set('view engine', 'hbs') 
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('views/images')); 
app.use(express.static('public'))
// set up customer routes
const customerRouter = require('./routes/customerRouter')
// GET home page
app.get('/', (req, res) => {res.render('home')})


app.use('/customer', customerRouter)


// Vendor
// set up vendor/order routes
const vendorRouter = require('./routes/vendorRouter')

app.use('/vendor', vendorRouter)

app.listen(process.env.PORT ||3000, () => {console.log('group 3 project is listening on port 3000!')})
module.exports = app