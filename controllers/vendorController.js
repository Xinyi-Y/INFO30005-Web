const mongoose = require("mongoose")
// import vendor model
const Vendor = mongoose.model("Vendor")
const Order = mongoose.model("Order")
const OwnOrder = mongoose.model("OwnOrder")
const Snack = mongoose.model("Snack")
const expressValidator = require('express-validator')
// (GET) https://xxx/vendor/order/:vendorId?status=outstanding
// get outstanding orders by searching one vendorId
// results are in ascending time order (more urgent ordes at the top)
const getOrderList = async (req, res) => {
    try {        
        const orders = await Order.find({"vendorId": req.params.vendorId, "status": req.query.status}).sort({"timeOrdered":1})
        if (orders === null) {
            res.status(404)
            return res.send("No orders found")
        }
        res.send(orders)         
    } catch (err) {
        res.status(400)
        return res.send("Database query failed")
    }
}; 

// (POST) https://xxx/vendor/order/:id
// update orders status (mark an order as "ready")
const orderStatusPostR = async (req, res) => {
    try{
        // find order by orderNum and marked as "ready"
        const orders = await Order.updateOne({ "orderNum": req.params.orderNum },
            { status: "ready"},      
            { runValidators: true })
            

        res.redirect('/vendor/operate')
        if(orders === null){
            res.status(404)
            return res.send("Unknown order number")
        }
        
    }
    catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
    }
}

// update orders status (mark an order as "fulfilled")
const orderStatusPostF = async (req, res) => {
    try{
        const orders = await Order.updateOne({ "orderNum": req.params.orderNum },
            { status: "fulfilled"},      
            { runValidators: true })
       
       res.redirect('/vendor/operate/')
        if(orders === null){
            res.status(404)
            return res.send("Unknown order number")
        }
        
    }
    catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
    }
}

// (PUT) https://xxx/:vendorId/status
// update vendor location and status
const updateVendorStatus = async (req, res) => {
    try {
        const query = req.body;
        await Vendor.updateOne({ "vendorId": req.params.vendorId },
            {
                lat: query.lat,
                lng: query.lng,
                streetNumber: query.streetNumber,
                streetName: query.streetName,
                city: query.city,
                postcode: query.postcode,
                status: query.status,
            },
            { runValidators: true });
        const oneVendor = await Vendor.findOne({ "vendorId": req.params.vendorId })
        return res.send(oneVendor)
    } catch (err) {
        res.status(400)
        return res.send(err.message)
    }
};


// (PUT) https://xxx/:vendorId/address
// update vendor short text of address
const updateVendorAddressText = async (req, res) => {
    try {
        if(typeof req.user !== 'undefined'){
            const query = req.body;
            console.log(query);
            await Vendor.updateOne({ "vendorId": req.user.vendorId },
                {
                    addressText: query.address
                },
                { runValidators: true });
            const oneVendor = await Vendor.findOne({ "vendorId": req.user.vendorId })
            res.redirect('/vendor/location')
        }else{
            res.redirect('/vendor');
        }
    } catch (err) {
        res.status(400)
        return res.send(err.message)
    }
};

const getLocation = async(req,res)=>{
	try {
		// retrieveing snack documents
		//res.send(result)
		if(typeof req.user !== 'undefined'){
            if(req.user.addressText != ""){
                res.render('Vlocation',{"location":req.user.addressText, "username":req.user.vendorName, layout: 'Vendermain.hbs'})
            }else{
                res.render('Vlocation',{"location":null, "username":req.user.vendorName, layout: 'Vendermain.hbs'})

            }
		}else{
			res.render('Vlocation',{"location":null,"username":null, layout: 'Vendermain.hbs'})
		} 
	//	res.render('menu', {"foods": result})	
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}
}
//open businessfor van user, set its geolocation and mark it as ready for orders, if a van is not logged in, redirect to home page
const openForBusiness = async(req,res)=>{
    try {
        if(typeof req.user !== 'undefined'){

            await Vendor.updateOne({ "vendorId": req.user.vendorId },
                {
                    lat: req.body.lat,
                    lng: req.body.long,
                    status: 'ready-for-orders'
                },
                { runValidators: true });
        }else{
            res.redirect('/vendor');
        }
    } catch (err) {
        res.status(400)
        return res.send(err.message)
    }
}
//reder operation page, find the vendor information, and get their orders. Find one specific order if required details
const operation = async(req,res)=>{
    try{
        if(typeof req.user !== 'undefined'){
            const act = new OwnOrder({
                orders:[]
            });
            console.log(req.user.orders.length);
            for(var i=0;i<req.user.orders.length;i++){
                var cur = req.user.orders[i]
                // search one order from cur by orderNum
                const one =  await Order.findOne({"orderNum": cur.orderNum})

                // check whether the time is up tp 15 minutes, if is then update the "discouted" to true
                if ((one.timeOrdered.getTime() + 15*60*1000)- (new Date().getTime()) <= 0 ){
                    await Order.updateOne({"orderNum": one.orderNum},
                    {
                        discounted : true
                    },
                    { runValidators: true }
                    )}   
                // add order to act
                act.orders.push(one)
            }
            let arr = []
            if(typeof req.params.id !== 'undefined'){
            
                var result = await Order.findOne({"orderNum":req.params.id});
		        //loop the content array to retrieve food items in content array
		        for (var i=0; i<result.content.length; i++) {
		    	    var obj = result.content[i]
		        	//search the snacks by foodId 
		      	    const fooditem = await Snack.findOne({"foodId": obj.foodId})
		       	    //add a key 'quantity' pair to the fooditem object for order detail display
			        fooditem.quantity = obj.quantity
			        //push the snack object in an array for further handlebars render
			        arr.push(fooditem)
		        }		
		        if (result === null) {   // the particular order is not found in database
                    res.status(404)
                    return res.send("order not found")
                 }
                res.render('Voperation',{"vanname":req.user.vendorName, "orders":act.orders, "thisOrder":result, "foodItem":arr,layout:'Vendermain.hbs'})
            }else{
                res.render('Voperation',{"vanname":req.user.vendorName, "orders":act.orders, "thisOrder":req.params.id,"foodItem":arr, layout:'Vendermain.hbs'})
            }
        }else{
            res.redirect('/vendor');
        }
    }catch (err) {
        res.status(400)
        return res.send(err.message)
    }
}
//allows vendor to close their business, mark their van as no longer ready
const closeBusiness = async(req,res)=>{
    try {
        if(typeof req.user !== 'undefined'){

            await Vendor.updateOne({ "vendorId": req.user.vendorId },
                {
                    status: 'not-ready'
                },
                { runValidators: true });
            req.logout();
            req.flash('');
            res.redirect('/vendor')
        }else{
            res.redirect('/vendor');
        }
    } catch (err) {
        res.status(400)
        return res.send(err.message)
    }
        // save the favourites
}
//allow display for all history pages
const allhistory = async(req, res) => {
    try {
		// retrieveing snack documents
        if(typeof req.user !== 'undefined'){
            const result = await Order.find({vendorId: req.user.vendorId})
            res.render('Vhistory',{"orders":result, "vendorname":req.user.vendorName,layout:'Vendermain.hbs'})
        }else{
            res.redirect('/vendor')
        }
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}
}
//search function from lecture, with some modification
const searchOrders = async (req, res) => { // search database for foods
	// first, validate the user input
	const validationErrors = expressValidator.validationResult(req)
    if(typeof req.user != 'undefined'){
	    if (!validationErrors.isEmpty() ) {
		    return res.status(422).render('error', {errorCode: '422', message: 'Search works on alphabet characters only.'})
	    }
	    // if we get this far, there are no validation errors, so proceed to do the search ...
	    var query = {}
	    if (req.body.userName !== '') {
		    query["userName"] = {$regex: new RegExp(req.body.userName, 'i') }
	    }
	    // the query has been constructed - now execute against the database
	    try {
		    const orders = await Order.find(query, {userName:true, orderNum:true, status:true, discounted:true})
            res.render('Vhistory',{"orders":orders, "vendorname":req.user.vendorName,layout:'Vendermain.hbs'})
	    } catch (err) {
		    console.log(err)
	    }
    }else{
        res.redirect('/vendor');
    }
}
//filter orders by discount
const searchOrdersByDis = async (req, res) => { // search database for foods
	// first, validate the user input
	const validationErrors = expressValidator.validationResult(req)
    if(typeof req.user != 'undefined'){
	    if (!validationErrors.isEmpty() ) {
	    	return res.status(422).render('error', {errorCode: '422', message: 'Search works on alphabet characters only.'})
	    }
	    // if we get this far, there are no validation errors, so proceed to do the search ...
	    var query = {}
	    query["discounted"] = true;

	    // the query has been constructed - now execute against the database
	    try {
	    	const orders = await Order.find(query, {userName:true, orderNum:true, status:true, discounted:true})
           res.render('Vhistory',{"orders":orders, "vendorname":req.user.vendorName,layout:'Vendermain.hbs'})
	    } catch (err) {
		    console.log(err)
	    }
    }else{
        res.redirect('/vendor');
    }
}
//filter orders by those that are not discounted
const searchOrdersByNotdis = async (req, res) => { // search database for foods
	// first, validate the user input
	const validationErrors = expressValidator.validationResult(req)
    if(typeof req.user != 'undefined'){
	    if (!validationErrors.isEmpty() ) {
		    return res.status(422).render('error', {errorCode: '422', message: 'Search works on alphabet characters only.'})
	    }
	// if we get this far, there are no validation errors, so proceed to do the search ...
	    var query = {}
	    query["discounted"] = false;

	// the query has been constructed - now execute against the database
	    try {
	    	const orders = await Order.find(query, {userName:true, orderNum:true, status:true, discounted:true})
          res.render('Vhistory',{"orders":orders, "vendorname":req.user.vendorName,layout:'Vendermain.hbs'})
	    } catch (err) {
		    console.log(err)
	    }
    }else{
        res.redirect('/vendor')
    }
}

const getOrderDetail = async(req, res) => {
	try {
        if(typeof req.user !== 'undefined'){
		    let arr = []
		    const result = await Order.findOne({"orderNum": req.params.orderNum})

		    //loop the content array to retrieve food items in content array
		    for (var i=0; i<result.content.length; i++) {
		    	var obj = result.content[i]
			//search the snacks by foodId 
		    	const fooditem = await Snack.findOne({"foodId": obj.foodId})
			//add a key 'quantity' pair to the fooditem object for order detail display
		    	fooditem.quantity = obj.quantity
			//push the snack object in an array for further handlebars render
		    	arr.push(fooditem)
	    	}		
	    	if (result === null) {   // the particular order is not found in database
                res.status(404)
               return res.send("order not found")
             }
		//res.send(result)
        	res.render('VorderDetail', {
		    	"thisOrder":result,
	    		"foodItem": arr,
	    	})
        }else{
            res.redirect('/vendor');
        }
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}

}
const getHome = async (req, res) => { // search database for foods
	// first, validate the user input
    res.render('Vhome',{layout: 'Vendermain.hbs', message: req.flash('loginMessage')})
}
// export the functions
module.exports = {
    getOrderList,
    orderStatusPostR,
    orderStatusPostF,
  
    updateVendorStatus,
    updateVendorAddressText,
    getLocation,
    openForBusiness,
    operation,
    closeBusiness,
    allhistory,
    searchOrders,
    searchOrdersByNotdis,
    searchOrdersByDis,
    getOrderDetail,
    getHome

}
