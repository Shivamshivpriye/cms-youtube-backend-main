const { validateProcess2, Process2 } = require("../models/Process2");
const auth = require("../middlewares/auth");
const mongoose = require("mongoose");
const router = require("express").Router();

// Create 
router.post("/process2", auth, async (req, res) => {
  try {
    const { error } = validateProcess2(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, address, company, email, phone, bill, forwardedToDesigner, orderdate, deliverydate, deadlinedate, invoiceno, quotation, advance, balance} = req.body;

    // Check if company name already exists
    const existingProcess = await Process2.findOne({ company });
    if (existingProcess) {
      return res.status(400).json({ error: "Company name already exists" });
    }

    const newProcess2 = new Process2({
      name,
      address,
      company,
      email,
      phone,
      bill,
      forwardedToDesigner,
      orderdate,
      deliverydate,
      deadlinedate,
      invoiceno,
      quotation,
      advance,
      balance,
      postedBy: req.user._id,
    });

    const result = await newProcess2.save();
    return res.status(201).json(result);
  } catch (err) {
    console.error("Error creating process2:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch 
router.get("/myprocess2", auth, async (req, res) => {
  try {
    const myProcess2 = await Process2.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );
    return res.status(200).json({ process2: myProcess2.reverse() });
  } catch (err) {
    console.error("Error fetching process2:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update 
router.put("/process2/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, company, email, phone, bill, forwardedToDesigner, orderdate, deliverydate, deadlinedate, invoiceno, advance, balance } = req.body;

    const updatedProcess2 = await Process2.findByIdAndUpdate(
      id,
      { name, address, company, email, phone, bill, forwardedToDesigner, orderdate, deliverydate, deadlinedate, invoiceno, advance, balance },
      { new: true }
    );

    if (!updatedProcess2) {
      return res.status(404).json({ error: "Process2 not found" });
    }

    return res.status(200).json(updatedProcess2);
  } catch (err) {
    console.error("Error updating process2:", err);
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
    const process2 = await Process2.findOne({ _id: id });
    if (!process2) return res.status(400).json({ error: "no process2 found" });

    if (req.user._id.toString() !== process2.postedBy._id.toString())
      return res
        .status(401)
        .json({ error: "you can't delete other people process2!" });

    const result = await Process2.deleteOne({ _id: id });
    const myProcess2 = await Process2.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );

    return res
      .status(200)
      .json({ ...process2._doc, myProcess2: myProcess2.reverse() });
  } catch (err) {
    console.log(err);
  }
});

// Fetch single
router.get("/process2/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const process2 = await Process2.findById(id);

    if (!process2) {
      return res.status(404).json({ error: "Process2 not found" });
    }

    return res.status(200).json(process2);
  } catch (err) {
    console.error("Error fetching process2:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
