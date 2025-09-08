 const Receipt = require("../models/ReceiptModel");

 const generateReceiptService =  async (receiptData)=>{
    console.log(receiptData,"receiptDataFromController")
    const createdReceipt =  await Receipt.create( receiptData );
    return createdReceipt
 }

 module.exports ={generateReceiptService}