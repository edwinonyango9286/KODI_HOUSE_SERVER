const Property = require("../models/propertyModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const Tenant = require("../models/tenantModel");
const _ = require("lodash");

const toSentenceCase = (str) => {
  return str
    .toLowerCase() // Convert the entire string to lower case
    .split(/(?<=[.!?])\s+/) // Split the string into sentences
    .map((sentence) => _.capitalize(sentence)) // Capitalize each sentence
    .join(" "); // Join the sentences back together
};

// add a new property
const addAProperty = expressAsyncHandler(async (req, res) => {
  try {
    const { _id } = req.landlord;
    validateMongoDbId(_id);
    const {
      name,
      category,
      type,
      numberOfUnits,
      rent,
      briefDescription,
      googleMap,
      images,
      location,
      currentStatus,
    } = req.body;
    if (
      !name ||
      !category ||
      !type ||
      !numberOfUnits ||
      !rent ||
      !briefDescription ||
      !googleMap ||
      !images ||
      !location ||
      !currentStatus
    ) {
      return res.status(404).json({
        status: "FAILED",
        message: "Please provide all the required fields.",
      });
    }
    // check for existing property by name
    const existingProperty = await Property.findOne({
      landlord: _id,
      name: _.startCase(_.toLower(name)),
    });
    if (existingProperty) {
      // if property exists and has been deleted restore the property
      if (existingProperty.isDeleted) {
        (existingProperty.isDeleted = false),
          (existingProperty.deletedAt = null),
          await existingProperty.save();
        return res.status(201).json({
          status: "SUCCESS",
          message: "Property created successfully.",
          data: existingProperty,
        });
      } else {
        return res.status(400).json({
          status: "FAILED",
          message: "A property with a simillar name already exist.",
        });
      }
    }
    const newProperty = await Property.create({
      ...req.body,
      name: _.startCase(_.toLower(name)),
      briefDescription: toSentenceCase(briefDescription),
      landlord: _id,
    });
    return res.status(201).json({
      status: "SUCCESS",
      message: "Property created successfully.",
      data: newProperty,
    });
  } catch (error) {
    return res.status(500).json({ status: "FAILED", message: error.message });
  }
});

// update a property
const updateAproperty = expressAsyncHandler(async (req, res, next) => {
  try {
    const { _id } = req.landlord;
    const { propertyId } = req.params;
    validateMongoDbId(_id);
    validateMongoDbId(propertyId);

    const {
      name,
      category,
      type,
      numberOfUnits,
      rent,
      briefDescription,
      googleMap,
      images,
      location,
      currentStatus,
    } = req.body;
    if (
      !name ||
      !category ||
      !type ||
      !numberOfUnits ||
      !rent ||
      !briefDescription ||
      !googleMap ||
      !images ||
      !location ||
      !currentStatus
    ) {
      return res.status(404).json({
        status: "FAILED",
        message: "Please provide all the required fields.",
      });
    }

    const updatedProperty = await Property.findOneAndUpdate(
      {
        _id: propertyId,
        landlord: _id,
      },
      {
        ...req.body,
        name: _.startCase(_.toLower(name)),
        briefDescription: toSentenceCase(briefDescription),
      },
      { new: true }
    );

    if (!updatedProperty) {
      return res
        .status(404)
        .json({ status: "FAILED", message: "Property not found." });
    }

    return res.status(200).json({ status: "SUCCESS", data: updatedProperty });
  } catch (error) {
    next(error);
  }
});

// get a property by Id

const getApropertyById = expressAsyncHandler(async (req, res) => {
  try {
    const { _id } = req.landlord;
    const { propertyId } = req.params;
    validateMongoDbId(_id);
    validateMongoDbId(propertyId);
    const property = await Property.findOne({ _id: propertyId, landlord: _id });
    if (!property) {
      return res
        .status(404)
        .json({ status: "FAILED", message: "Property not found." });
    }
  } catch (error) {
    return res.status(500).json({ status: "FAILED", message: error.message });
  }
});

// get all properties related to the landlord
const getAllProperties = expressAsyncHandler(async (req, res) => {
  try {
    const { _id } = req.landlord;
    validateMongoDbId(_id);
    const properties = await Property.find({ landlord: _id });
    return res.status(200).json({ status: "SUCCESS", properties });
  } catch (error) {
    return res.status(500).json({ status: "FAILED", message: error.message });
  }
});

// asign a property and to a tenant
const asignPropertyToAtenant = expressAsyncHandler(async () => {
  try {
    const { propertyId } = req.params;
    const { tenantId } = req.body;
    validateMongoDbId(propertyId);
    validateMongoDbId(tenantId);
    const tenant = await Tenant.findOne({
      _id: tenantId,
      landlord: req.landlord._id,
    });
    if (!tenant) {
      return res
        .status(404)
        .json({ status: "FAILED", message: "Tenant not found." });
    }

    // check if a property is already assigned to another tenant
    const property = await Property.findById(propertyId);
    if (property.currentOccupant || property.currentStatus === "Occupied") {
      return res.status(400).json({
        status: "FAILED",
        message: "Property already assigned to a tenant.",
      });
    }
    // if property doesn't have  and tenant occupant asign the property to the tenant
    const assignedProperty = await Property.findOneAndUpdate(
      { _id: propertyId, currentOccupant: null, currentStatus: "Vacant" },
      { currentOccupant: tenantId, currentStatus: "Occupied" },
      { new: true },
      { runValidators: true }
    );

    if (!assignedProperty) {
      return res
        .status(400)
        .json({ status: "FAILED", message: "Property not found." });
    }

    return res.status(200).json({
      status: "SUCCESS",
      message: `${property.name} has been assigned to ${tenant.firstName}`,
      assignedProperty,
    });
  } catch (error) {
    return res.status(500).json({ status: "FAILED", message: error.message });
  }
});

// delete a property
const deleteAProperty = expressAsyncHandler(async (req, res) => {});

module.exports = {
  addAProperty,
  getApropertyById,
  getAllProperties,
  updateAproperty,
  deleteAProperty,
  asignPropertyToAtenant,
};
