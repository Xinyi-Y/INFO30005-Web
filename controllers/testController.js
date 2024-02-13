const VendorTest = require('../models/VendorTest')
const expressValidator = require('express-validator')
const ready = async(req,res)=>{
    try {
        const vendor = await VendorTest.updateOne({"vendorId":req.params.vendorId},{status:"ready-for-orders"})

        console.log("vendor",vendor);
        res.render('Vhome')
      } catch (err) {
        res.render('Vhome')
      }
}
const quit = async(req,res)=>{

  const vendor = new VendorTest(req.body);
  try {
       await VendorTest.updateOne({"vendorId":vendor.vendorId},{status:'not-ready'});
       let result = await VendorTest.findOne({"vendorId":vendor.vendorId});

      return res.send(result)           // return saved object to sender
  } catch (err) {   // error detected
        console.log(err)
      res.status(307)
      return res.send("Database insert failed")
  }
}
module.exports = {ready, quit}