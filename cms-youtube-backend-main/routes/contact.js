const { validateContact, Contact } = require("../models/Contact");
const auth = require("../middlewares/auth");
const mongoose = require("mongoose");
const router = require("express").Router();

// Create contact.
router.post("/contact", auth, async (req, res) => {
  try {
    const { error } = validateContact(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, address, company, email, phone,products,requirement,status,query} = req.body;
    const newContact = new Contact({
      name,
      address,
      company,
      email,
      phone,
      products,
      requirement,
      status,
      query,
      postedBy: req.user._id,
    });

    const result = await newContact.save();
    return res.status(201).json(result);
  } catch (err) {
    console.error("Error creating contact:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch contacts.
router.get("/mycontacts", auth, async (req, res) => {
  try {
    const myContacts = await Contact.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );
    return res.status(200).json({ contacts: myContacts.reverse() });
  } catch (err) {
    console.error("Error fetching contacts:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update contact.
router.put("/contact/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, company, email, phone,products,requirement,status,query } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, address, company, email, phone,products,requirement,status,query },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    return res.status(200).json(updatedContact);
  } catch (err) {
    console.error("Error updating contact:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a contact.
router.delete("/delete/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified." });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });
  try {
    const contact = await Contact.findOne({ _id: id });
    if (!contact) return res.status(400).json({ error: "no contact found" });

    if (req.user._id.toString() !== contact.postedBy._id.toString())
      return res
        .status(401)
        .json({ error: "you can't delete other people contacts!" });

    const result = await Contact.deleteOne({ _id: id });
    const myContacts = await Contact.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );

    return res
      .status(200)
      .json({ ...contact._doc, myContacts: myContacts.reverse() });
  } catch (err) {
    console.log(err);
  }
});

// Fetch a single contact.
router.get("/contact/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    return res.status(200).json(contact);
  } catch (err) {
    console.error("Error fetching contact:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
