const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    // id is usually from req.user so no need to validate
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
    },
    transactionId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 2000,
    },
    amount: {
      type: Number,
      required: true,
    },
    attachment: {
      secure_url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    paymentMode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModesOfPayment",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Receipt", receiptSchema);
