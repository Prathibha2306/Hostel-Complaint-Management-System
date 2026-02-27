const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const verifyToken = require("../middleware/authMiddleware");


// 🟢 Submit Complaint
router.post("/", verifyToken, async (req, res) => {
  try {
    const { category, description } = req.body;

    if (!category || !description) {
      return res.status(400).json({ message: "All fields required" });
    }

    const complaint = new Complaint({
      userId: req.user.id,
      category,
      description,
    });

    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// 🟢 Get My Complaints (Student)
router.get("/my", verifyToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// 🟢 Get All Complaints (Admin)
router.get("/", verifyToken, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// 🟢 Update Status (Admin)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;