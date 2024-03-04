const { validateProcess3, Process3 } = require("../models/Process3");
const auth = require("../middlewares/auth");
const mongoose = require("mongoose");
const router = require("express").Router();

// Create 
router.post("/process3", auth, async (req, res) => {
  try {
    const { error } = validateProcess3(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, address, company, email, phone, designername, designermbno, designeremail, designermbno2, amount,status} = req.body;

    // Check if company name already exists
    const existingProcess = await Process3.findOne({ company });
    if (existingProcess) {
      return res.status(400).json({ error: "Company name already exists" });
    }

    const newProcess3 = new Process3({
      name,
      address,
      company,
      email,
      phone,
      designername,
      designermbno,
      designeremail,
      designermbno2,
      amount,
      status,
      postedBy: req.user._id,
    });

    const result = await newProcess3.save();
    return res.status(201).json(result);
  } catch (err) {
    console.error("Error creating process3:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch 
router.get("/myprocess3", auth, async (req, res) => {
  try {
    const myProcess3 = await Process3.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );
    return res.status(200).json({ process3: myProcess3.reverse() });
  } catch (err) {
    console.error("Error fetching process3:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update 
router.put("/process3/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, company, email, phone, designername, designermbno, designeremail, designermbno2, amount,status} = req.body;

    const updatedProcess3 = await Process3.findByIdAndUpdate(
      id,
      { name, address, company, email, phone, designername, designermbno, designeremail, designermbno2, amount,status},
      { new: true }
    );

    if (!updatedProcess3) {
      return res.status(404).json({ error: "Process3 not found" });
    }

    return res.status(200).json(updatedProcess3);
  } catch (err) {
    console.error("Error updating process3:", err);
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
    const process3 = await Process3.findOne({ _id: id });
    if (!process3) return res.status(400).json({ error: "no process3 found" });

    if (req.user._id.toString() !== process3.postedBy._id.toString())
      return res
        .status(401)
        .json({ error: "you can't delete other people process3!" });

    const result = await Process3.deleteOne({ _id: id });
    const myProcess3 = await Process3.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );

    return res
      .status(200)
      .json({ ...process3._doc, myProcess3: myProcess3.reverse() });
  } catch (err) {
    console.log(err);
  }
});

// Fetch single
router.get("/process3/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const process3 = await Process3.findById(id);

    if (!process3) {
      return res.status(404).json({ error: "Process3 not found" });
    }

    return res.status(200).json(process3);
  } catch (err) {
    console.error("Error fetching process3:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
