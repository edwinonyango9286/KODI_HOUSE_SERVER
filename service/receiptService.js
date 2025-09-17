 const Receipt = require("../models/ReceiptModel");
 const User = require("../models/userModel");

 const generateReceiptService =  async (receiptData)=>{
    console.log(receiptData,"receiptDataFromController")
    const createdReceipt =  await Receipt.create( receiptData );
    return createdReceipt
 }


 const listAllReceiptsService = async(userId)=>{


   const userMakingRequest =  await User.findById()




 }

 module.exports ={generateReceiptService}