const mongoose = require("mongoose")
const vendorSchema = new mongoose.Schema({ 
    vendorId: {type: Number, required: true, unique: true},
    vendorName: {type: String},
    status:{type: String, enum:['ready-for-orders','not-ready'], default: 'not-ready', required:true},
})
const VendorTest = mongoose.model("VendorTest", vendorSchema)

module.exports = VendorTest