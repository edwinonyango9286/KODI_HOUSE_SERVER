const Role = require("../models/roleModel");
const User = require("../models/userModel");
const { generateUserPassword } = require("../utils/generateUserPassword");
const _ = require("lodash");
const sendMail = require("../utils/sendMails");

const createTenantService = async (tenantData, userId) => {
   const existingTenant = await User.findOne({email:tenantData.email });
   if(existingTenant){
      throw new Error(`Tenant with email ${existingTenant.email} already exist.` )
   }
   const tenantRole =  await Role.findOne({ name:"Tenant"});
   if(!tenantRole){
      throw new Error("Tenant role not found.")
   }
   const userPassword =  generateUserPassword();
   const createdTenant  = await User.create({ ...tenantData, role:tenantRole._id , createdBy:userId, password:userPassword, firstName:_.startCase(tenantData.firstName), secondName:_.startCase(tenantData.secondName)});
   const data = { user:{ userName: `${createdTenant.firstName} ${createdTenant.secondName}`, email:createdTenant.email}, password:userPassword}
   await sendMail({ email: createdTenant.email, subject: "Tenant account creation", template: "user-account-creation.ejs", data,});
   return createdTenant
}


module.exports = { createTenantService }