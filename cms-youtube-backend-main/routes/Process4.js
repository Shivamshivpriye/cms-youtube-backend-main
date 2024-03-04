const { validateProcess4, Process4 } = require("../models/Process4");
const auth = require("../middlewares/auth");
const mongoose = require("mongoose");
const router = require("express").Router();

// Create 
router.post("/process4", auth, async (req, res) => {
  try {
    const { error } = validateProcess4(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, address, company, email, phone, feedback, paymentstatus, comment } = req.body;

    // Check if company name already exists
    const existingProcess = await Process4.findOne({ company });
    if (existingProcess) {
      return res.status(400).json({ error: "Company name already exists" });
    }

    const newProcess4 = new Process4({
      name,
      address,
      company,
      email,
      phone,
      feedback,
      paymentstatus,
      comment,
      
      postedBy: req.user._id,
    });

    const result = await newProcess4.save();
    return res.status(201).json(result);
  } catch (err) {
    console.error("Error creating process4:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch 
router.get("/myprocess4", auth, async (req, res) => {
  try {
    const myProcess4 = await Process4.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );
    return res.status(200).json({ process4: myProcess4.reverse() });
  } catch (err) {
    console.error("Error fetching process4:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update 
router.put("/process4/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, company, email, phone, feedback,paymentstatus,comment,} = req.body;

    const updatedProcess4 = await Process4.findByIdAndUpdate(
      id,
      { name, address, company, email, phone,feedback,paymentstatus,comment,},
      { new: true }
    );

    if (!updatedProcess4) {
      return res.status(404).json({ error: "Process4 not found" });
    }

    return res.status(200).json(updatedProcess4);
  } catch (err) {
    console.error("Error updating process4:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete 
router.delete("/delete/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified." });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });
  try {
    const process4 = await Process4.findOne({ _id: id });
    if (!process4) return res.status(400).json({ error: "no process4 found" });

    if (req.user._id.toString() !== process4.postedBy._id.toString())
      return res
        .status(401)
        .json({ error: "you can't delete other people process4!" });

    const result = await Process4.deleteOne({ _id: id });
    const myProcess4 = await Process4.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );

    return res
      .status(200)
      .json({ ...process4._doc, myProcess4: myProcess4.reverse() });
  } catch (err) {
    console.log(err);
  }
});

// Fetch single
router.get("/process4/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const process4 = await Process4.findById(id);

    if (!process4) {
      return res.status(404).json({ error: "Process4 not found" });
    }

    return res.status(200).json(process4);
  } catch (err) {
    console.error("Error fetching process4:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
