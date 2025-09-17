const Joi = require("joi");

const createTenantSchema = Joi.object({
    firstName: Joi.string().required(),
    secondName: Joi.string().required(),
    email:Joi.string().email().required(),
    phoneNumber:Joi.string().required(),
    properties: Joi.array().items(Joi.string()),
    units: Joi.array().items(Joi.string()),
    moveInDate:Joi.date().max("now")
})

module.exports ={ createTenantSchema }



