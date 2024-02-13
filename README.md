**The University of Melbourne**
# INFO30005 – Web Information Technologies

# Group Project Repository

Welcome!

## Table of contents
* [Team Members](#team-members)
* [General Info](#general-info)
* [Technologies](#technologies)
* [Code Implementation](#code-implementation)
* [Front-End Usability](#front-end-usability)
* [Dummy-value](#dummy-value)
## Team Members

| Name | Task | State |
| :---         |     :---:      |          ---: |
| Kelvin Hu | customerRoute, customerController, db schema, customer Postman Request     |  Done |
| Xinyi Ye    | vendor outstanding order readme, customer Postman Request, vendor Postman Request       |  Done |
| Yue Liang    | vendor updating address and status      |  Done |
| Yimeng Liu    | show list of all outstanding orders      |  Done |
| Ling Huang   |   Mark an order as "fulfilled"   |  Done |

## General info
### Commit Id
a2a17914c85b0c000f4d7a3edc2a493d85c4aaa9
### URL
In this deliverable, we have implemented routes to support customer and vendor features. The deliverable is hosted on [https://foodvan3.herokuapp.com](https://foodvan3.herokuapp.com). With customer routes implemented on [https://foodvan3.herokuapp.com/customer](https://foodvan3.herokuapp.com/customer) and vendor routes implemented on [https://foodvan3.herokuapp.com/vendor](https://foodvan3.herokuapp.com/vendor).\
### Mongo Database
Mongo Database connection string `mongodb+srv://<username>:<password>@cluster0.ef8um.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
* MONGO_USERNAME=localuser
* MONGO_PASSWORD=UXArNW9M3a8B930G
* PASSPORT_KEY=abcd
### Test user data
#### Vendor
* Username =test
* Password =test
* All available vans within the database has the same password as its van name
## Technologies
Project is created with:
* NodeJs 14.16.X
* Ipsum version: 2.33
* Ament library version: 999

## Code Implementation
### Test
routes to call the testing functions are located in vendor routes
#### Unit Testing
For unit testing , we tested opening for business feature by imitating vendor, which changed vendor status to ready for order. 
We did not test to change vendor status to not ready, because if the test can change it from not ready to ready, then it should be simple to reverse it.
```HTML
<!--
    Here is the test case
__>
        _id: '60741060d14008bd0efff9d5',
        vendorId: 3,
        vendorName: 'ar',
        status: 'ready-for-orders',
        __v: 0
```
#### Integration Testing
For Integration testing, to ensure the process of setting the vendor's status as ready for orders is fluent and correct. We tested the quit function to check if the status of the vendor can be changed to not ready. The logic for quit function is later implemented in the logout functions for vendors.
```HTML
<!--
    Here is the test case
__>
        _id: '60741060d14008bd0efff9d5',
        vendorId: 3,
        vendorName: 'ar',
        status: 'ready-for-orders',
        __v: 0
```
### Customer Features
#### View menu of snacks (including pictures and prices)
The feature of viewing the menu of snacks is implemented on [https://foodvan3.herokuapp.com/customer/menu](https://foodvan3.herokuapp.com/customer/menu). This feature is implmented through the getMenu function, utilising Mongoose.Model() on the "snackSchema" to retrieve all documents within the collection, and use res.send() to set the contents retrieved as text and returns the response. This code is implmented within a try catch block, to catch potential errors, in which case would respond with "Database query failed"
```HTML
<!--
 getMenu function code snippet
__>
try {
	const result = await Snack.find()
	res.send(result)
	} 
catch (err) {
	console.log(err)
	res.status(400)
	return res.send("Database query failed")
	}
```
#### View details of a snack
The feature of viewing the menu of snacks is implemented on https://foodvan3.herokuapp.com/customer/snack/:foodId, with ':foodId' replaced by a valid foodId within the database. This feature is implemented through the getDetail function. The implementation of this feature is similar to the implmentation of the view menu of snacks, except using Mongoose.model.findOne() to find the one snack that is requested. If the snack was not found by the .findOne() function, getDetail would return a response of "Snack not found"
```HTML
<!--
  .findOne() snack snippet
__>
const result = await Snack.findOne({"foodId": req.params.foodId})
if (result === null) {   // no author found in database
  res.status(404)
  return res.send("snack not found")
}
```
####  Customer starts a new order by requesting a snack
This feature is accessed through a post request on https://foodvan3.herokuapp.com/customer/user/neworder. Using this route (/user/neworder) is to extend future usability, if in the future we need to request user information, we may get the route /user.\
This feature is implmented through the function createorder, which needs to take in four parameters in req.body.
* foodID: the foodID of the snack requested
* loginId: the loginId of the user requesting the snack
* vendorId: the vendorId of the vendor which this order is made to
* quantity: the quantity of the snack requested\
If anyone of foodId, loginId, vendorId does not exist within the database, an error response will be returned.\
When all inputs are valid, a new `Item` will be created. Which will be stored within a newly created `Order` and saved into the **orders** collection in the database. The `User` that has the input loginId would also have its orders array pushed with the new `Order` created, likewise, the `Vendor` that has the input vendorId would also have its orders array pushed.
```HTML
<!--
  push newOrder into collections
__>
await userdata.orders.push(newContainOrder)
await userdata.save()
await vendordata.orders.push(newContainOrder)
await vendordata.save()
await newOrder.save()
```
### Customer Postman Request
#### View menu of snacks (including pictures and prices)
Get request on the url https://foodvan3.herokuapp.com/customer/menu.
###### Expected output
 The expected return is shown below
 ```HTML
 <!--
  get request on /menu
__>
 [
    {
        "glutenfree": false,
        "organic": true,
        "vegan": true,
        "_id": "606d05b69d90b34c0cd3cdb2",
        "foodId": "4",
        "foodName": "Long black",
        "imageurl": "/4.jpeg",
        "price": 2,
        "calories": 22,
        "description": "test"
    },
    {
        "glutenfree": false,
        "organic": true,
        "vegan": true,
        "_id": "606d05b69d90b34c0cd3cdb4",
        "foodId": "6",
        "foodName": "Fancy biscuit",
        "imageurl": "/6.jpeg",
        "price": 2,
        "calories": 22,
        "description": "test"
    },
    {
        "glutenfree": false,
        "organic": true,
        "vegan": true,
        "_id": "606d05b69d90b34c0cd3cdb0",
        "foodId": "2",
        "foodName": "Latte",
        "imageurl": "/2.jpeg",
        "price": 3,
        "calories": 22,
        "description": "coffee, beverage, yum"
    },
    {
        "glutenfree": false,
        "organic": true,
        "vegan": true,
        "_id": "606d05b69d90b34c0cd3cdb5",
        "foodId": "7",
        "foodName": "Small cake",
        "imageurl": "/7.jpeg",
        "price": 2,
        "calories": 22,
        "description": "small cake, smaller than the big cake"
    },
    {
        "glutenfree": false,
        "organic": true,
        "vegan": true,
        "_id": "606d05b69d90b34c0cd3cdb3",
        "foodId": "5",
        "foodName": "Plain biscuit",
        "imageurl": "/5.jpeg",
        "price": 2,
        "calories": 22,
        "description": "test"
    },
    {
        "glutenfree": true,
        "organic": true,
        "vegan": true,
        "_id": "606d05b69d90b34c0cd3cdb1",
        "foodId": "3",
        "foodName": "Flat white",
        "imageurl": "/3.jpeg",
        "price": 34,
        "calories": 22,
        "description": "test"
    },
    {
        "glutenfree": false,
        "organic": true,
        "vegan": true,
        "_id": "606d05b69d90b34c0cd3cdb6",
        "foodId": "8",
        "foodName": "Big cake",
        "imageurl": "/8.jpeg",
        "price": 2,
        "calories": 22,
        "description": "Big cake, bigger than the small cake"
    },
    {
        "glutenfree": true,
        "organic": true,
        "vegan": true,
        "_id": "606d05b69d90b34c0cd3cdaf",
        "foodId": "1",
        "foodName": "Cappuccino",
        "imageurl": "/1.jpeg",
        "price": 23,
        "calories": 22,
        "description": "coffee, beverage, yum"
    }
]
```
##### Displaying images in menu
Clicking on the imageurl would navigate to the image link. For instance, clicking on /1.jpeg in foodId 1 would navigate to the link https://foodvan3.herokuapp.com/1.jpeg. Which would display the following image.

<p align="center">
  <img src="views/images/1.jpeg"  width="300" >
</p>

#### View details of a snack
Get request on the url https://foodvan3.herokuapp.com/customer/snack/:foodId, with ':foodId' replaced with a current valid foodId stored in the database. Current sample values include (1,2,3,4,5,6,7,8). 
###### Expected output
The expected return with foodId 1 is shown below. If a non-valid foodId was entered, for example 9, a response showing 'snack not found' will be returned.
```HTML
 <!--
  get request on /snack/:foodId
__>
{
    "glutenfree": true,
    "organic": true,
    "vegan": true,
    "_id": "606d05b69d90b34c0cd3cdaf",
    "foodId": "1",
    "foodName": "Cappuccino",
    "imageurl": "/1.jpeg",
    "price": 23,
    "calories": 22,
    "description": "coffee, beverage, yum"
}
```
####  Customer starts a new order by requesting a snack
Post request on the url https://foodvan3.herokuapp.com/customer/user/neworder. The input body expects four variables
* foodId: a String, Sample foodId includes ("1","2","3","4","5","6","7","8")
  * Invalid foodId: reutrn error message "snack not found"
* loginId: a String, Sample loginId include ("Mario","loginId","definitelyNotAFakeEmail@email.com","customer@login")
  * Invalid loginId: reutrn error message "user not found"
* vedorId: a String, Sample vendorId include ("1","2","3")
  * Invalid vendorId: reutrn error message "vendor not found"
* quantity: a Number that can not be less than 1
  * Invalid quantity: return error message "Quantity can not be lower than 1"
###### Expected output
The output for this post request depends on the current orders array in the input `User` and input `Vendor`. As posting in this route would not only create a new order, but also push that order in the **orders** array in `User` and `Vendor`.\
If both have empty orders, the expected return from a sample value of {"foodId":"2","loginId":"customer@login","vendorId":"3","quantity":2} is displayed below.
```HTML
 <!--
    get request on /user/neworder with input body {"foodId":"2","loginId":"customer@login","vendorId":"3","quantity":2}
__>
{
    "Order": {
        "status": "outstanding",
        "_id": "6081851ce2a32d00156c83a4",
        "orderNum": 6,
        "userId": "customer@login",
        "vendorId": "3",
        "discounted": false,
        "content": [
            {
                "_id": "6081851ce2a32d00156c83a3",
                "foodId": "2",
                "pricePerItem": 3,
                "quantity": 2
            }
        ],
        "cost": 6,
        "timeOrdered": "2021-04-22T14:15:56.481Z",
        "__v": 0
    },
    "Vendor": {
        "status": "not-ready",
        "_id": "608184621ff0b18980af4a35",
        "vendorId": "3",
        "vendorName": "Super",
        "orders": [
            {
                "_id": "6081851ce2a32d00156c83a5",
                "orderNum": 6
            }
        ],
        "lat": 19.32,
        "lng": 12.231,
        "city": "Mel",
        "postcode": "1234",
        "streetName": "streetName",
        "streetNumber": 123,
        "addressText": "here",
        "__v": 1
    },
    "User": {
        "_id": "608183e41ff0b18980af4a34",
        "firstName": "customerName",
        "lastName": "customerName",
        "loginId": "customer@login",
        "password": "password",
        "orders": [
            {
                "_id": "6081851ce2a32d00156c83a5",
                "orderNum": 6
            }
        ],
        "__v": 1
    }
}
```
### Vendor Features
#### Show list of all outstanding orders
The feature of viewing the list of all outstanding orders of one vendor is implemented on https://foodvan3.herokuapp.com/vendor/order/:vendorId?status=outstanding, with ':vendorId' replaced with a current valid vendorId stored in the database. Vendor with the input vendorId is found and orders of outstanding status marked by such vendor are returned as response via res.send(). Orders are sorted by "timeOrdered" attribute and returned in ascending time order. "No orders found" is returned if orders can't be found in the collelction. This code is implmented within a try catch block, to catch potential errors, in which case would respond with "Database query failed"
```HTML
<!--
  .find() outstanding orders snippet
__>
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
```
####  Updating Order Status
The feature of updating an order's status is implemented on https://foodvan3.herokuapp.com/vendor/order/:id, the :id should use a current valid id of the order in the database. Each id should have an order number and status, otherwise, it will return “Unknown order number” through res. send().If it is a correct input, the status of the order will be updated through findByIdAndUpdate().This code is implmented within a try catch block, to catch potential errors, in which case would respond with "Database query failed"
```HTML
<!--
 orderStatusPost function code snippet
__>
try{
    const orders = await Order.find({"orderNum": req.params.orderNum, "status": req.query.status})
    if(orders === null){
        res.status(404)
        return res.send("Unknown order number")
    }
    Order.findByIdAndUpdate(
        req.params.id,
        {status: req.body.status},
        {new: true},
        function(err,Post){
            if(err){
                res.status(404).json({success:false,err:err})
            }
            else{
                res.status(200).json({success:true,Post:Post})
            }
        }
    )
}
catch (err) {
	console.log(err)
	res.status(400)
	return res.send("Database query failed")
}
```

####  Updating Van Address and Status
Users can update their van address by putting https://foodvan3.herokuapp.com/:vendorId/address by typing short string of their address and vendors are able to mark their van as "ready-for-orders" or "not-ready" by typing string by putting put https://foodvan3.herokuapp.com/:vendorId/status, otherwise it will be returning http 400 error. With the input of "vendorAddress" or "vendorStatus", a respond with the current status, id, name, latitude and longitude ，city, postcode, street number, street name and address text will be given via res.send.
```HTML
<!--
const updateVendorAddressText = async (req, res) => {
    try {
        const query = req.body;
        await Vendor.updateOne({ "vendorId": req.params.vendorId },
            {
                addressText: query.addressText
            },
            { runValidators: true });
        const oneVendor = await Vendor.findOne({ "vendorId": req.params.vendorId })
        return res.send(oneVendor)
    } catch (err) {
        res.status(400)
        return res.send(err.message)
    }
};
```


### Vendor Postman Request
#### Show list of all outstanding orders
Get request on the url https://foodvan3.herokuapp.com/vendor/order/:vendorId?status=outstanding, with ':vendorId' replaced with a current valid vendorId stored in the database. Current sample values include (1,2). A query of orders {status: outstanding} is send to return any orders marked as outstanding status by the vendor with input vendorId. Orders are returned in ascending time order.

###### Expected output
The expected return with vendorId 2 is shown below. Order created earlier will be shown at the top. If no such orders exist in the database, a response showing 'No orders found' will be returned.
```HTML
 <!--
  get request on /order/:vendorId?status=outstanding
__>
[
    {
        "status": "outstanding",
        "_id": "60812f3e07c3e3001557eb04",
        "orderNum": 3,
        "userId": "Mario",
        "vendorId": "2",
        "discounted": false,
        "content": [
            {
                "_id": "60812f3e07c3e3001557eb03",
                "foodId": "1",
                "pricePerItem": 23,
                "quantity": 2
            }
        ],
        "cost": 46,
        "timeOrdered": "2021-04-22T08:09:34.016Z",
        "__v": 0
    },
    {
        "status": "outstanding",
        "_id": "608177e8e2a32d00156c8392",
        "orderNum": 5,
        "userId": "Mario",
        "vendorId": "2",
        "discounted": false,
        "content": [
            {
                "_id": "608177e8e2a32d00156c8391",
                "foodId": "5",
                "pricePerItem": 2,
                "quantity": 2
            }
        ],
        "cost": 4,
        "timeOrdered": "2021-04-22T13:19:36.676Z",
        "__v": 0
    }
]
```
####  Updating Van Address

To test the address updating feature, https://foodvan3.herokuapp.com/vendor/2/address please use the PUT method, and type anything in the "address"
```HTML
<!--
{
"addressText":"adsfadfasdf"
}
```
An example address would be 
Input:
```HTML
<!--
{
"adsfadfasdf"
}
```
###### Expected output
```HTML
<!--
{
    "status": "ready-for-orders",
    "_id": "607ed93cdf91e6ede740806e",
    "vendorId": "2",
    "vendorName": "Trailer",
    "orders": [
        {
            "_id": "60812d9507c3e3001557eaff",
            "orderNum": 2
        },
        {
            "_id": "60812f3e07c3e3001557eb05",
            "orderNum": 3
        },
        {
            "_id": "608177e8e2a32d00156c8393",
            "orderNum": 5
        }
    ],
    "lat": 2.213212312,
    "lng": 32.1212,
    "city": "cool",
    "postcode": "0987",
    "streetName": "test",
    "streetNumber": 123,
    "addressText": "adsfadfasdf",
}
```
####  Updating Van Status
To test the status updating feature, use the link https://foodvan3.herokuapp.com/vendor/2/status and please use the Put method, and type:
```HTML
<!--
{
"status":
"lat": 
"lng":
"status":
"city":
"postcode":
"streetName":
"streetNumber":
"addressText":
}
```
you can type anything after the colon
Missing any attributes when inputing will receive the result showing that attribute is "null"
There are only two status available, "ready-for-orders" or "not-ready", inputing status other than this would receive a http 400 error.
An example would be：
Input:
```HTML
<!--
{"lat": 2.213212312,
"lng": 32.1212,
"city": "cool",
"postcode": "0987",
"streetName": "test",
"streetNumber": 123,
"status":"ready-for-orders"}
}
```
###### Expected output
```HTML
<!--
{
    "status": "ready-for-orders",
    "_id": "607ed93cdf91e6ede740806e",
    "vendorId": "2",
    "vendorName": "Trailer",
    "orders": [
        {
            "_id": "60812d9507c3e3001557eaff",
            "orderNum": 2
        },
        {
            "_id": "60812f3e07c3e3001557eb05",
            "orderNum": 3
        },
        {
            "_id": "608177e8e2a32d00156c8393",
            "orderNum": 5
        }
    ],
    "lat": 2.213212312,
    "lng": 32.1212,
    "city": "cool",
    "postcode": "0987",
    "streetName": "test",
    "streetNumber": 123,
    "addressText": "adsfadfasdf",
}
```

####  Updating Order Status
Post request on the url https://foodvan3.herokuapp.com/vendor/order/:id, the :id should use a current valid id of the order in the database. For example, https://foodvan3.herokuapp.com/vendor/order/60812d9507c3e3001557eafd.
The input body should be {"status":<any status for order(should be String type)>}. For example,{"status":"fulfilled"}.

###### Expected output
The expected return with id 160812d9507c3e3001557eafd is shown below. If the order is not found in the database, a response showing 'Unknown order number' will be returned.
```HTML
<!--
{
    "Post": {
        "status": "fullfilled",
        "_id": "60812d9507c3e3001557eafe",
        "orderNum": 2,
        "userId": "Mario",
        "vendorId": "2",
        "discounted": false,
        "content": [
            {
                "_id": "60812d9507c3e3001557eafd",
                "foodId": "2",
                "pricePerItem": 3,
                "quantity": 2
            }
        ],
        "cost": 6,
        "timeOrdered": "2021-04-22T08:02:29.988Z",
        "__v": 0
    }
}
```
## Front-End Usability (Customer App)
### Menu
In Menu, the following features to improve front end user usability has been implemented:
* In the top navigation bar, when hovering over the navigation tools, the background color changes to white, highlighting the selection.
* When hovering over the items within the menu, the background color would be highlighted to highlight the selction.
* The filter buttons on the left, when clicked on, there will be a flicker, signifying it successfully filtered the menu.

### Detail of nearest vans
* Location of each five vans is draw on the map when the user clicks `Show vans on map` button
* When hovering over the `order now` button besides a van, the background color changes to greeen, highlighting the selection.
* Users will be direct to the menu page and place order under the van they selected.

### LOGIN DETAILS
#### Login
On the home page, the User can click `Login` button to enter the login page. 
Also, Users can choose to log in on the menu page with the `Login` button or will be asked to login if an order need to be placed. 
If the input password or email is incorrect, respective error message will be shown as reminder.
There are two registered examples in the database, the email is `test`||`123` and  password is `test`||`TestTest666`
The user will be direct to the Home page to reaccess self location and find out the five vans nearby fter successfully login. It is designed in such way since the location of users may be changed and should be updated once they login to order.

#### Signup
On the login page, Click on `Don't have an account? Click Me!` to enter the signup page.
And enter email, password family name, and given name click Submit, it will back to the home page if the email address can be registered.
If the input password or email is incorrectly set by the user, respective error message will be shown as reminder.

#### Logout
on the home page, the User can click `Personal`, `Logout` in the top navigation bar to log out. 
Also, Users can choose to log out on the menu page with the `Logout` button. The Login button will not be displayed If the user is not logged in.

## Dummy-Value
One dummy value for user is LoginId: test , Password:test \
We implemented signup features. So users may also signup and create and use their own login details.

## Front-End Usability (Vendor App)
### Login
On the vendor homepage, vendor needs to sign in first by entering the Van name and password and then click `Submit` button.

### Open for business
On the location page, vendor can open for business by directly cliking `Open for business` button if he has geoloacation, or vendor can enter the address that they want to open and click `Submit` button. And then vendor can open by clicking `Open for business` button. Customer can make orders of this van. 

### Logout
On the location page, vendor can click `LogOut` button to close the van and redirect to the signin page. If want to reopen the van, vendor needs to sign in again.

### Operation
On the operation page, outstanding orders will be displayed on the right-hand side. Each order detail will be displayed in the center. Pick up orders will be displayed on the left-hand side. Vendor can click each order to see the order detail and check the time-left. 
* If the order is ready and within 15 minutes for customer to pick up, vendor can click `Ready` button and then the order status will be changed to "ready" and move to PickUp orders. 
* If the order is not ready and exceed 15 minutes, a message will be displayed in order detail and vendor can click to check. The status of discounted is changed to "true".
* Similarly, when the order is picked by customer, vendor should click `Fulfilled` button. All fulfilled and cancelled orders will be displayed in the history page by clicking `History` button. 
* By clicking `Back` button, vendor can choose a new location to open or logout to close.

### History
On the history page, vendor can find all the fulfilled and cancelled orders. 
* Vendor can search by username by enter the UserName and click `Search` button. 
* Vendor can find all the orders by click `All Time` button. 
* Vendor can find all orders with 20% discount by click `Discounted` button. 
* Vendor can find all orders without 20% discount by click `Not Discounted` button. 

## References
#### Image references
* https://unsplash.com/photos/Y3AqmbmtLQI (Image by Nathan Dumiao)
* https://unsplash.com/photos/6VhPY27jdps (Image by Nathan Dumiao)
* https://unsplash.com/photos/c2Y16tC3yO8 (Image by Nathan Dumiao)
* https://unsplash.com/photos/pMW4jzELQCw (Image by Nathan Dumiao)
* https://unsplash.com/photos/rjf4FcmERGc (Image by rümeysa aydın)
* https://unsplash.com/photos/to2bO8Gktkk (Image by Fran Jacquier)
* https://unsplash.com/photos/hcEDfkiVmMI (Image by kaouther djouada)
* https://unsplash.com/photos/tW0Ix_Ajg6Y (Image by Deva Williamson)

**Now Get ready to complete all the tasks:**

- [x] Read the Project handouts carefully
- [x] User Interface (UI)mockup
- [ ] App server mockup
- [ ] Front-end + back-end (one feature)
- [ ] Complete system + source code
- [ ] Report on your work(+ test1 feature)

