const express = require('express')
// add our router 
const vendorRouter = express.Router()
const testRouter = express.Router()
const testController = require('../controllers/testController.js')
const expressValidator = require('express-validator')
// require the vendor controller
const vendorController = require('../controllers/vendorController.js')

const Vpassport = require('passport');

require('../config/passport')(Vpassport);
const utility = require('./utility');
// add our router




// handle the GET request to get order list of one vendor
vendorRouter.get('/order/:vendorId', (req, res) => vendorController.getOrderList(req,res))
// handle the POST request to mark order status
vendorRouter.post('/orderr/:orderNum',(req,res) => vendorController.orderStatusPostR(req,res))
vendorRouter.post('/orderf/:orderNum',(req,res) => vendorController.orderStatusPostF(req,res))
//vendorRouter.post('/orderd/:orderNum',(req,res) => vendorController.orderStatusPostD(req,res))
// handle the PUT request to update status and location
vendorRouter.put('/:vendorId/status', (req, res) => vendorController.updateVendorStatus(req,res))
// handle the PUT to update address text
vendorRouter.put('/:vendorId/address', (req, res) => vendorController.updateVendorAddressText(req,res))


vendorRouter.get('/', (req, res) => vendorController.getHome(req,res))
// POST login form -- authenticate user
vendorRouter.post('/', Vpassport.authenticate('local-Vlogin', {
    successRedirect : '/vendor/location', // redirect to the homepage
    failureRedirect : '/vendor', // redirect back to the login page if there is an error
    failureFlash : true // allow flash messages
}));
//allows vendor to logout and close business as an aftermath
vendorRouter.post('/logout',utility.isLoggedIn,(req,res)=>vendorController.closeBusiness(req,res))
//allows vendor to access their locations operations
vendorRouter.get('/location', utility.isLoggedIn,(req,res)=>vendorController.getLocation(req,res))
//handle vendor setting address
vendorRouter.post('/setaddress',utility.isLoggedIn,(req,res)=>vendorController.updateVendorAddressText(req,res))
//handle requesting vendor geolocation
vendorRouter.post('/geo', utility.isLoggedIn,(req,res)=>vendorController.openForBusiness(req,res))

vendorRouter.get('/open', utility.isLoggedIn,(req,res)=>testController.ready(req,res))
vendorRouter.post('/quit', utility.isLoggedIn,(req,res)=>testController.quit(req,res))
//handle get request to the operation page for vendors
vendorRouter.get('/operate',utility.isLoggedIn,(req,res)=>vendorController.operation(req,res))
//handle get request to having an order displayed in operation page
vendorRouter.get('/operate/:id', (req, res) => vendorController.operation(req,res))
//handle get request to order rhistory page
vendorRouter.get('/history',utility.isLoggedIn, (req, res) => vendorController.allhistory(req,res))
//handle request to search for something
vendorRouter.post('/history/search', utility.isLoggedIn,expressValidator.body('userName').isAlpha().optional({checkFalsy: true}), (req, res) => vendorController.searchOrders(req, res))  // includes validation of user input
vendorRouter.post('/search/dis', utility.isLoggedIn,expressValidator.body('disFilter').isAlpha().optional({checkFalsy: true}), (req, res) => vendorController.searchOrdersByDis(req, res))
vendorRouter.post('/search/notdis', utility.isLoggedIn,expressValidator.body('notdisFilter').isAlpha().optional({checkFalsy: true}), (req, res) => vendorController.searchOrdersByNotdis(req, res))
vendorRouter.get('/orders/:orderNum', utility.isLoggedIn,(req, res) => vendorController.getOrderDetail(req, res));

// export the router

//operate page, left outstanding, right pickup, left has button to mark to pickup, right has button to mark to fulfilled
//everytime the page loads, if an order is cancelled make it grey, if it is updated (have a list of lists of updates, so each updates would have many small updates on snacks)
//take only the last update, and process with that
//remember to have timer
//if one order is over time, make it red
//timer, input time that is current - when order is created, and countdown from that, once reach 0, it is overdues
module.exports = vendorRouter