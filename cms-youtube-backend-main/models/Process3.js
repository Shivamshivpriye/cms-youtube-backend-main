const mongoose = require("mongoose");
const Joi = require("joi");

const Process3Schema = new mongoose.Schema({
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
  designername: {
    type: String,
    required: [false, "Designer Name is required."],
  },
  designermbno: {
    type: String,
    required: [false, "Designer mb no is required."],
  },
  designeremail: {
    type: String,
    required: [false, "Designer email is required."],
  },
  designermbno2: {
    type: String,
    required: [false, "Designer mb no2 is required."],
  },
  amount: {
    type: String,
    required: [false, "Amount is required."],
  },
  status:{
    type: String,
    enum: ['work','completed','redo','ongoing'],
    required: false,
  },
  

});

const Process3 = new mongoose.model("Process3", Process3Schema);

const validateProcess3 = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).required(),
    company: Joi.string().min(4).max(50).required(),
    address: Joi.string().min(4).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().trim().regex(/^\+?\d{7,}$/).required(),
    designername: Joi.string().min(4).max(50),
    designermbno: Joi.string().trim().regex(/^\+?\d{7,}$/),
    designeremail: Joi.string().email(),
    designermbno2: Joi.string().trim().regex(/^\+?\d{7,}$/),
    amount: Joi.string().trim().regex(/^\+?\d{7,}$/),
    status: Joi.string().valid('work','completed','redo','ongoing'), 


  });

  return schema.validate(data);
};

module.exports = {
  validateProcess3, 
  Process3,
};
