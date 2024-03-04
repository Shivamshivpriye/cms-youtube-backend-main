const mongoose = require("mongoose");
const Joi = require("joi");

const ContactSchema = new mongoose.Schema({
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
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: {
    type: String,
    required: [true, "Product is required."],
  },
   requirement: {
    type: String,
    required: [true, "Requirement is required."],
  },
  status: {
    type: String,
    enum: ["Called", "Not responding", "Cancelled", "On hold", "Call later", "Follow us", "Redial"],
    required: true,
  },
  query: {
    type: String,
    required: [false, "Any text."],
  },
});

const Contact = new mongoose.model("Contact", ContactSchema);

const validateContact = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).required(),
    company: Joi.string().min(4).max(50).required(),
    address: Joi.string().min(4).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().trim().regex(/^\+?\d{7,}$/).required(),
    products: Joi.string().min(4).max(50).required(),
    requirement: Joi.string().min(4).max(50).required(),
    status: Joi.string().valid("Called", "Not responding", "Cancelled", "On hold", "Call later", "Follow us", "Redial").required(), 
    query: Joi.string().min(4).max(50),
  });

  return schema.validate(data);
};

module.exports = {
  validateContact, 
  Contact,
};
