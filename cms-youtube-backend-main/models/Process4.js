const mongoose = require("mongoose");
const Joi = require("joi");

const Process4Schema = new mongoose.Schema({
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
    unique: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  feedback: {
    type: String,
    required: [false, "Feedback is required."],
  },
  paymentstatus:{
    type: String,
    enum: ["hold","balance","discount","done"],
    required: false,
  },
  comment: {
    type: String,
    required: [false, "Any comment."],
  },
  
  

});

const Process4 = new mongoose.model("Process4", Process4Schema);

const validateProcess4 = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).required(),
    company: Joi.string().min(4).max(50).required(),
    address: Joi.string().min(4).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().trim().regex(/^\+?\d{7,}$/).required(),
    feedback: Joi.string().min(4).max(100),
    paymentstatus: Joi.string().valid("hold","balance","discount","done"), 
    comment: Joi.string().min(4).max(100),
     


  });

  return schema.validate(data);
};

module.exports = {
  validateProcess4, 
  Process4,
};
