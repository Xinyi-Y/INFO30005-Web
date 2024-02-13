const express = require('express')
// add our router 
const customerRouter = express.Router()
const expressValidator = require('express-validator')
const customerController = require('../controllers/customerController.js')
const passport = require('passport');

require('../config/passport')(passport);
const utility = require('./utility');

// GET login form
customerRouter.get("/login", (req, res) => {
    res.render('login', {layout: 'main.hbs', message: req.flash('loginMessage')});
});

// POST login form -- authenticate user
customerRouter.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the homepage
    failureRedirect : '/customer/login', // redirect back to the login page if there is an error
    failureFlash : true // allow flash messages
}));



customerRouter.get("/signup", (req, res) => {
    res.render('signup');
});


customerRouter.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the homepage
    failureRedirect : '/customer/signup/', // redirect to signup page
    failureFlash : true // allow flash messages
}));

customerRouter.post('/logout', function(req, res) {
    // save the favourites
    req.logout();
    req.flash('');
    res.redirect('/');
});


// handle the GET request to get menu of snacks
customerRouter.get('/menu',utility.isLoggedIn,(req,res) => customerController.getMenu(req, res))
// handle the GET request to get specific details of one snack
customerRouter.get('/snack/:foodId', (req, res) => customerController.getDetail(req,res))
//handle the POST request to create new order when requesting a snack
customerRouter.post('/user/neworder',(req,res) => customerController.createOrder(req,res))
//handle POST request to search for a food in menu
customerRouter.post('/search',utility.isLoggedIn,expressValidator.body('foodName').isAlpha().optional({checkFalsy: true}), (req, res) => customerController.searchFoods(req, res))  // includes validation of user input
customerRouter.post('/search/drink',utility.isLoggedIn, expressValidator.body('drinkFilter').isAlpha().optional({checkFalsy: true}), (req, res) => customerController.searchFoodsByDrinks(req, res))
customerRouter.post('/search/snack', utility.isLoggedIn,expressValidator.body('snackFilter').isAlpha().optional({checkFalsy: true}), (req, res) => customerController.searchFoodsBySnacks(req, res))

customerRouter.get('/geo/:lat/:lng',  (req, res) => customerController.postLocation(req, res));
customerRouter.get('/updateTempVendorId/:tempVendorId', utility.isLoggedIn,(req, res) => customerController.updateTempVendorId(req, res))

//handle the GET request to view all orders
customerRouter.get('/order',utility.isLoggedIn, utility.isLoggedIn, (req, res) => customerController.getAllOrders(req, res))
// handle the GET request to view the details of one order
customerRouter.get('/order/:orderNum', (req, res) => customerController.getOrderDetail(req, res))


customerRouter.get('/remove/:id', (req, res) => customerController.removeFromCart(req, res))
customerRouter.get('/placeorder', utility.isLoggedIn,(req, res) => customerController.placeOrder(req, res))
customerRouter.get('/add/:id',utility.isLoggedIn, (req, res) => customerController.addTOcart(req, res))
customerRouter.get('/confirmOrder', utility.isLoggedIn,(req, res) => customerController.confirmOrder(req, res))
customerRouter.get('/changeOrder/:orderNum', utility.isLoggedIn,(req, res) => customerController.changeOrder(req, res))
customerRouter.get('/cencleOrder/:orderNum', utility.isLoggedIn,(req, res) => customerController.cencleOrder(req, res))
customerRouter.get('/giveDiscount/:orderNum', utility.isLoggedIn,(req, res) => customerController.giveDiscount(req, res))
// export the router
module.exports = customerRouter
