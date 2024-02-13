const mongoose = require('mongoose')
const Snack = mongoose.model("Snack")
const Order = mongoose.model("Order")
const Item = mongoose.model("Item")
const User = mongoose.model("User")
const Vendor = mongoose.model("Vendor")
const Cart = require('../data/cart')
const ContainOrder = mongoose.model("ContainOrder")
var path = require('path');
const expressValidator = require('express-validator')
// handle request to get menu
const getMenu = async(req, res) => {
    try {
		// retrieveing snack documents
		const result = await Snack.find()
		//res.send(result)
		if(typeof req.user !== 'undefined'){
			res.render('menu',{"foods":result, "username":req.user.firstName})
		}else{
			res.render('menu',{"foods": result,"username":null})
		} 
	//	res.render('menu', {"foods": result})	
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}
}
// handle get request to get details of specific snack
const getDetail = async(req,res) => {
	try {
		const result = await Snack.findOne({"foodId": req.params.foodId})
		if (result === null) {   // the particular snack is not found in database
            res.status(404)
            return res.send("snack not found")
        }
		if(typeof req.user !== 'undefined'){
			res.render('snackDetail',{"thisfood":result, "username":req.user.username})
		}else{
			res.render('snackDetail',{"thisfood": result,"username":null})
		} 

	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}
}
//handle post request to create an order on request of a snack
const createOrder = async (req,res) => {
	//input body require foodId, loginId, vendorId, qunatity
	var ordernum = 1;
	try {
		const result = await Snack.findOne({"foodId": req.body.foodId})
		const userdata = await User.findOne({"loginId" : req.body.loginId})
		const vendordata = await Vendor.findOne({"vendorId": req.body.vendorId})
		const highorder = await Order.find().sort({orderNum: -1}).limit(1)
		//if vendorId is not found in the database
		if(vendordata === null){
			res.status(404)
			return res.send("vendor not found")
		}
		//if loginId is not found in the database
		if(userdata === null){
			res.status(404)
			return res.send("user not found")
		}
		//if foodId is not found in the database
		if (result === null) {   //  snack is not found in database
            res.status(404)
            return res.send("snack not found")
        }
		//if quantity is less than 1
		if(req.body.quantity < 1){
			res.status(404)
			return res.send("Quantity can not be lower than 1")
		}
		//set the order number of the new order as the highest ordernumber in the database plus 1, if there is no orders, set it as default (1)
		if(highorder[0] != null){
			ordernum = highorder[0].orderNum + 1
		}
	
		const newItem = new Item({
			foodName:result.foodName,
			foodId: req.body.foodId,
			pricePerItem: result.price,
			quantity: req.body.quantity
		})
		const newOrder = new Order({
			userName: userdata.firstName,
			orderNum: ordernum,
			userId: req.body.loginId,
			vendorId: req.body.vendorId,
   		 	discounted: false,
    		content: [],
    		cost: 0,
			status: 'outstanding'
		})
		const newContainOrder = new ContainOrder({
			orderNum: ordernum
		})
		//push the items into the orders, as its items
		await newOrder.content.push(newItem)
		//set the cost in the order as original plus the total cost from the requested food
		newOrder.cost = newItem.pricePerItem * newItem.quantity
		//push the newly created order containment into orders array in user and vendor
		await userdata.orders.push(newContainOrder)
		await userdata.save()
		await vendordata.orders.push(newContainOrder)
		await vendordata.save()
		await newOrder.save()
		res.send({Order: newOrder, Vendor: vendordata, User:userdata})
		//res.send(JSON.stringify(req.body))
		/*res.render('order', {
			snackData: JSON.stringify(req.body), id:result.id, imageurl:result.imageurl
		})*/
	} catch (err) {
		res.status(400)
		return res.send("Database query failed")
	}
}

//search function from lecture, with some modification
const searchFoods = async (req, res) => { // search database for foods
	// first, validate the user input
	const validationErrors = expressValidator.validationResult(req)
	if (!validationErrors.isEmpty() ) {
		return res.status(422).render('error', {errorCode: '422', message: 'Search works on alphabet characters only.'})
	}
	// if we get this far, there are no validation errors, so proceed to do the search ...
	var query = {}
	if (req.body.foodName !== '') {
		query["foodName"] = {$regex: new RegExp(req.body.foodName, 'i') }
	}
	if (req.body.vegan) {
		query["vegan"] = true
	}
	if (req.body.organic) {
		query["organic"] = true
	}
	// the query has been constructed - now execute against the database
	try {
		const foods = await Snack.find(query, {foodName:true, imageurl:true, foodId:true, price:true})
		if(typeof req.user !== 'undefined'){
			res.render('menu',{"foods":foods, "username":req.user.firstName})
		}else{
			res.render('menu',{"foods": foods,"username":null})
		} 
	} catch (err) {
		console.log(err)
	}
}

//search function from lecture, with some modification
const searchFoodsByDrinks = async (req, res) => { // search database for foods
	// first, validate the user input
	const validationErrors = expressValidator.validationResult(req)
	if (!validationErrors.isEmpty() ) {
		return res.status(422).render('error', {errorCode: '422', message: 'Search works on alphabet characters only.'})
	}
	// if we get this far, there are no validation errors, so proceed to do the search ...
	var query = {}
	query["type"] = "drink";

	// the query has been constructed - now execute against the database
	try {
		const foods = await Snack.find(query, {foodName:true, imageurl:true, foodId:true, price:true})
		if(typeof req.user !== 'undefined'){
			res.render('menu',{"foods":foods, "username":req.user.firstName})
		}else{
			res.render('menu',{"foods": foods,"username":null})
		} 
	} catch (err) {
		console.log(err)
	}
}


//search function from lecture, with some modification
const searchFoodsBySnacks = async (req, res) => { // search database for foods
	// first, validate the user input
	const validationErrors = expressValidator.validationResult(req)
	if (!validationErrors.isEmpty() ) {
		return res.status(422).render('error', {errorCode: '422', message: 'Search works on alphabet characters only.'})
	}
	// if we get this far, there are no validation errors, so proceed to do the search ...
	var query = {}
	query["type"] = "snack";

	// the query has been constructed - now execute against the database
	try {
		const foods = await Snack.find(query, {foodName:true, imageurl:true, foodId:true, price:true})
		if(typeof req.user !== 'usndefined'){
			res.render('menu',{"foods":foods, "username":req.user.firstName})
		}else{
			res.render('menu',{"foods": foods,"username":null})
		} 	
	} catch (err) {
		console.log(err)
	}
}

//handle the GET request to view all orders
const getAllOrders = async(req, res) => {
	try{
		let arr = []
		//retrieve all orders
		const user = await User.findOne({"loginId":req.user.loginId})
		/*
		console.log('user:' + user.lastName)
		console.log(user.orders)
		console.log(user.orders.length)
		*/
		
		//loop the content array to retrieve food items in content array
		for (var i=0; i<user.orders.length; i++) {
			var obj = user.orders[i]
			arr.push(obj.orderNum)
			/*
			console.log(obj)
			console.log(obj.orderNum)
			*/
			
		}
		const result = await Order.find({"orderNum": arr})

		//const result = await Order.find({"userId":req.user.loginId})
		//output the result
		res.render('allOrders', {
			"orders":result
		})
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}
}

// handle the GET request to view the details of one order
const getOrderDetail = async(req, res) => {
	try {
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
    	res.render('orderDetail', {
			"thisOrder":result,
			"foodItem": arr
		})
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}

}
const addTOcart = async (req, res) => {
	if(typeof req.user !== 'undefined'){
		
		let id = req.params.id
		let snack = await Snack.findOne({ foodId: id });
		let cart = new Cart(req.session.cart ? req.session.cart : {});
		let count = Object.entries(cart.items).length;
		//console.log(snack);
		//console.log(id);
		cart.add(snack, id);
		req.session.cart = cart;
		res.redirect('/customer/menu/');
	}
	else{
		res.redirect('/customer/login/');
	}


}

const removeFromCart = async (req, res) => {
	let id = req.params.id
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	cart.remove(id);
	req.session.cart = cart;
	res.redirect('/customer/placeorder');
}

const placeOrder = async (req, res) => {
	if(typeof req.user !== 'undefined'){
		if (!req.session.cart) {
			return res.render('cart', {
				snacks: null
			});
		}
		let cart = new Cart(req.session.cart);
		res.render('cart', {
			title: 'Your Cart',
			snacks: cart.getItems(),
			totalPrice: cart.totalPrice
		});
	}
	else{
		res.redirect('/customer/login');
	}
}


const changeOrder = async (req, res) => {
	//find that user with loginid
	const user = await User.findOne({"loginId": req.user.loginId});
	if(user === null){
		res.status(404)
		return res.send("user not found")
	}

	//find all foods which customer pick before
	let cart = new Cart(req.session.cart ? req.session.cart : {});
		const result = await Order.findOne({"orderNum": req.params.orderNum})
		for (var i=0; i<result.content.length; i++) {
			var obj = result.content[i]
			const fooditem = await Snack.findOne({"foodId": obj.foodId})
			fooditem.quantity = obj.quantity
			cart.add(fooditem, fooditem.foodId);
		}

	id=result.id;
    updatestr={'status':'changed'};
	//update status
	Order.findByIdAndUpdate (id,updatestr,function(err,res){
        if (err) {
            console.log("Error:" + err);
        }
    })
	//save to cart
	req.session.cart = cart;

	res.redirect('/customer/placeOrder');
}

const cencleOrder = async (req, res) => {
	//find that user with loginid
	const user = await User.findOne({"loginId": req.user.loginId});
	if(user === null){
		res.status(404)
		return res.send("user not found")
	}
	//find which orderunmber
	const result = await Order.findOne({"orderNum": req.params.orderNum})
	id=result.id;
    updatestr={'status':'cancelled'};
	//update status
	Order.findByIdAndUpdate (id,updatestr,function(err,res){
        if (err) {
            console.log("Error:" + err);
        }
    })
	res.redirect('/customer/menu');
}


const giveDiscount = async (req, res) => {
	//find that user with loginid
	oNum = req.params.orderNum;
	const user = await User.findOne({"loginId": req.user.loginId});
	if(user === null){
		res.status(404)
		return res.send("user not found")
	}
	//find which orderunmber
	const result = await Order.findOne({"orderNum": oNum})
	id=result.id;
	discountCost = result.cost *0.8
    //update status
	updatestr={'discounted':true,'cost':discountCost};
	Order.findByIdAndUpdate (id,updatestr,function(err,res){
        if (err) {
            console.log("Error:" + err);
        }
    })
	ul = '/customer/order/' + oNum
	res.redirect(ul);
}

const updateTempVendorId = async (req, res) => {

	// store the tempVendorId no matter the user is login or not
	tempVendorId = req.params.tempVendorId;
	req.session.tempVID = tempVendorId;
	var i = new Number(tempVendorId)

    updatestr={'tempVendor': i};
	console.log(updatestr)
	req.session.updatestr = updatestr;
	//if login or not
	if(typeof req.user !== 'undefined'){
		const user = await User.findOne({"loginId": req.user.loginId});
		if(user === null){
			res.status(404)
			return res.send("user not found")
		}

		//update the vendor chose by the user
		id = user.id;
		console.log(id)
		User.findByIdAndUpdate (id,updatestr,function(err,res){
			console.log("under findbyupdate")
			console.log(updatestr)
			if (err) {
				console.log("Error:" + err);
			}
		})
		res.redirect('/customer/menu');

	}else{
		res.redirect('/customer/menu');
	} 


}



const confirmOrder = async (req, res) => {
	//find which user
	var ordernum = 0;
	let cart = new Cart(req.session.cart);
	const user = await User.findOne({"loginId": req.user.loginId});
	if(user === null){
		res.status(404)
		return res.send("user not found")
	}
	//find highest order's order number
	const highorder = await Order.find().sort({orderNum: -1}).limit(1)
	if(highorder[0] != null){
		ordernum = highorder[0].orderNum + 1
	}
	const now = new Date()
	// creata new order
	let order = await new Order({
		userName: user.firstName,
		userId: user.loginId,
		vendorId: user.tempVendor,
		orderNum: ordernum,
		discounted: false,
		content: [],
		cost: cart.totalPrice,
		timeOrdered:now,
	})
	// got item from cart
	for (let el of cart.getItems()) {
		let item = new Item({
			foodName:el.item.foodName,
			foodId: el.item.foodId,
			pricePerItem: el.item.price,
			quantity: el.quantity,
		})
		//save item to order's content
		order.content.push(item);
	};
	await order.save()
//find which vendor
	const vendor = await Vendor.findOne({"vendorId": user.tempVendor});

	console.log(user.tempVendor)
	console.log(req.user.loginId)

	const newContainOrder = new ContainOrder({
		orderNum: ordernum
	})

	console.log(newContainOrder)

	//save order to user and vendor
	await user.orders.push(newContainOrder)
	await vendor.orders.push(newContainOrder)
	await user.save()
	await vendor.save()
	//console.log(order.content)

	delete req.session.cart;
	ul = "/customer/order/"+ordernum
	res.redirect(ul);
}

const getOrder = async (req, res) => {
	let orders = await Order.find({});
	res.render('orders',
		{
			title: 'Orders',
			orders,
		}
	);
}


const postLocation = async (req, res) => {
	try {
		//new array for save all vendor's distance and vendor id
		let distanceArr = []
		let vendoridArr = []

		//Get the user's location
		const latitude = req.params.lat
		const longitude = req.params.lng

		/*
		console.log("location under getvans")
		console.log(latitude)
		console.log(longitude)
		*/

		// Converts numeric degrees to radians
		function toRad(Value) 
		{
			return Value * Math.PI / 180;
		}

		//find all vendor
		const result = await Vendor.find()
		for (i=0; i<result.length; i++) {
			//console.log(result[i].lat)
			//find all vendor which have address
			if ((result[i].lat!=null) && (result[i].lng!=null)) {
				var R = 6371; // km
				var dLat = result[i].lat - latitude
				var dLon = result[i].lng - longitude
				var lat1 = toRad(latitude);
				var lat2 = toRad(longitude);

				var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
				var distance = R * c;
				
				//add into array
				distanceArr.push({
					"distance": distance,
					"vendorId": result[i].vendorId,
				})
			}	
		}
		
		// sort the distance in ascending order
		distanceArr.sort(function({distance:a}, {distance:b}) {
			return a - b;
		});

		//find top 5
		for (j=0; j<5; j++) {
			//save thier vendor id
			vendoridArr.push(distanceArr[j].vendorId)
		}

		// find the 5 nearest vendor's all infomation
		const vendors = await Vendor.find({"vendorId":vendoridArr})
		
		// store the 5 vans' location and parse as input to draw on the map later in detail page
		var plist = []
		for (i=0; i<vendors.length;i++) {
			a = a + 1;
			//console.log(vendors[i].vendorName)
			var position = []
			position.push(vendors[i].lat)
			position.push(vendors[i].lng)
			//console.log(position)
			plist.push(position)
		}
		//console.log(plist)

		if(typeof req.user !== 'undefined'){
			res.render('fiveVans',{'vendors': vendors, positions: plist, 'loginId':req.user.loginId})
		}else{
			res.render('fiveVans',{'vendors': vendors, positions: plist, 'user':null})
		} 

	} catch (err) {
		console.log(err)
		res.status(400)
		return res.send("Database query failed")
	}

}




module.exports = {
    giveDiscount,updateTempVendorId,cencleOrder,changeOrder,getMenu,getDetail,createOrder,searchFoods,searchFoodsByDrinks,searchFoodsBySnacks,getAllOrders,getOrderDetail, addTOcart, removeFromCart, placeOrder, confirmOrder, getOrder, postLocation
}
