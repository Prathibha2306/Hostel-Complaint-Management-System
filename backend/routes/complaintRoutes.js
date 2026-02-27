const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  const { category, description, priority } = req.body;

  const complaint = new Complaint({
    userId: req.user.id,
    category,
    description,
    priority
  });

  await complaint.save();
  res.json({ msg: "Complaint Submitted" });
});

router.get("/", auth, async (req, res) => {
  const complaints = await Complaint.find();
  res.json(complaints);
});

router.put("/:id", auth, async (req, res) => {
  await Complaint.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  });

  res.json({ msg: "Status Updated" });
});

module.exports = router;