const Member = require('../models/Member');

// Get all active members for dropdown selection
exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new member
exports.createMember = async (req, res) => {
  try {
    const { name, email, phone, membershipId } = req.body;
    const member = await Member.create({ name, email, phone, membershipId });
    res.status(201).json({ success: true, data: member, message: 'Member registered' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};