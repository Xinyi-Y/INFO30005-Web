const mongoose = require("mongoose")
const bcrypt   = require('bcrypt-nodejs')
const snackSchema = new mongoose.Schema({
    foodId: {type: String,required:true, unique: true},
    foodName: {type: String, required: true, unique: true},
    imageurl: String,
    price: {type: Number, min: 0},
    glutenfree: {type: Boolean, default: false},
    calories: {type: Number, min: 0},
    description: String,
    organic: {type: Boolean, default: false},
    vegan: {type: Boolean, default: false},
    type:{type:String, enum:['drink','snack']}
})
const itemSchema = new mongoose.Schema({
    foodId:{type: String, required: true},
    foodName:{type:String},
    pricePerItem:{type:Number, min: 0},
    quantity:{type:Number,min:1}
})
const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    userName:{type:String},
    vendorId:{type: Number, required: true},
    orderNum: {type: Number, required:true, min:1,unique:true},
    discounted: {type: Boolean, required: true},
    content: [itemSchema],
    cost: {type: Number, min: 0},
    timeOrdered: {type: Date, default: Date.now},
    status:{type: String, enum:['fulfilled', 'outstanding', 'ready','changed', 'cancelled'], default: 'outstanding', required:true},
    updated:{type:String, enum:['true','false'],default:"false"}
})
const ownOrderSchema = new mongoose.Schema({
    orders:[orderSchema]
})
const containOrderSchema = new mongoose.Schema({
    orderNum: {type:Number, required:true, min:1}
})
const vendorSchema = new mongoose.Schema({ 
    vendorId: {type: Number, required: true, unique: true},
    vendorName: {type: String},
    orders: [containOrderSchema],
    lat: {type: Number,default: -1},
    lng: {type: Number, default: -1},
    status:{type: String, enum:['ready-for-orders','not-ready'], default: 'not-ready', required:true},
    streetNumber:{type: Number},
    streetName:{type: String},
    city:{type: String},
    postcode:{type: String},
    addressText:{type: String, default:""},
    password:{type:String, required:true}
})

const userSchema = new mongoose.Schema({
    lastName:{type: String, required: true},
    firstName:{type:String, required: true},
    loginId:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    tempVendor:{type:Number},
    orders:[containOrderSchema]
})
// method for generating a hash; used for password hashing
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
// method for generating a hash; used for password hashing
vendorSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
vendorSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
const Snack = mongoose.model("Snack", snackSchema)
const Item = mongoose.model("Item",itemSchema)
const Order = mongoose.model("Order", orderSchema)
const User = mongoose.model("User",userSchema)
const Vendor = mongoose.model("Vendor",vendorSchema)
const ContainOrder = mongoose.model("ContainOrder",containOrderSchema)
const OwnOrder = mongoose.model("OwnOrder",ownOrderSchema)
module.exports = {Snack,Order,Item,User,Vendor,ContainOrder,OwnOrder}