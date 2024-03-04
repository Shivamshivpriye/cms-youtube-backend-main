const mongoose = require("mongoose");
const Joi = require("joi");

const Process2Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  address: {
    type: String,
    required: [true, "Address is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
  },
  phone: {
    type: String, // Changed to string type
    required: [true, "Phone number is required."],
  },
  company: {
    type: String,
    required: [true, "Company name is required."],
    unique: true, // Ensuring company name is unique
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bill: {
    type: String,
    required: [false, "bill is required."],
  },
  forwardedToDesigner:{
    type: String,
    enum: ["Yes", "No"],
    required: false,
  },
  orderdate: {
    type: String,
    required: [false, "orderdate is required."],
  },
  deliverydate: {
    type: String,
    required: [false, "deliverydate is required."],
  },
  deadlinedate: {
    type: String,
    required: [false, "deadlinedate is required."],
  },
  invoiceno: {
    type: String,
    required: [false, "invoiceno is required."],
  },
  quotation: {
    type: String,
    required: [false, "quotation is required."],
  },
  advance: {
    type: String,
    required: [false, "advance is required."],
  },
  balance: {
    type: String,
    required: [false, "balance is required."],
  },

});

const Process2 = new mongoose.model("Process2", Process2Schema);

const validateProcess2 = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).required(),
    company: Joi.string().min(4).max(50).required(),
    address: Joi.string().min(4).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().trim().regex(/^\+?\d{7,}$/).required(),
    bill: Joi.string().min(4).max(50),
    forwardedToDesigner: Joi.string().valid("Yes", "No"), 
    orderdate: Joi.string().trim().regex(/^\+?\d{7,}$/),
    deliverydate: Joi.string().trim().regex(/^\+?\d{7,}$/),
    deadlinedate: Joi.string().trim().regex(/^\+?\d{7,}$/),
    invoiceno: Joi.string().min(4).max(50),
    quotation: Joi.string().min(4).max(50),
    advance: Joi.string().min(4).max(50),
    balance: Joi.string().min(4).max(50),
  });

  return schema.validate(data);
};

module.exports = {
  validateProcess2, 
  Process2,
};
