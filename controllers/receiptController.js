const expressAsyncHandler = require("express-async-handler");
const Receipt = require("../models/ReceiptModel");
const { createReceiptSchema } = require("../validationSchemas/receipts");
const User = require("../models/userModel");
const { generateReceiptService } = require("../service/receiptService");


const generateReceipt = expressAsyncHandler(async(req, res)=>{
    const {error, value} = createReceiptSchema.validate(req.body);
    if(error){
        return res.status(400).json({ status:"FAILED", message:error.details[0].message});
    }
   const generatedReceipt =  await generateReceiptService({ ...value, createdBy:req.user._id});
   return res.status(200).json({ status:"SUCCESS", message:"Receipt generated successfully",data:generatedReceipt})
});


const getAllReceipts = expressAsyncHandler(async(req,res)=>{
    const userMakingRequest = await User.findById(req.user._id).populate("role","name");
    let query;
    if(userMakingRequest.role.name === "Admin"){
        query = Receipt.find({ isDeleted:false });
    }else if(userMakingRequest.role.name ==="Landlord"){
        query = Receipt.find({ createdBy:req.user._id, isDeleted:false})
    }
    const allReceipts = await query;
    return res.status(200).json({ status:'SUCCESS', message:"Receipts listed successfully.", data:allReceipts });
})

module.exports = { getAllReceipts, generateReceipt }