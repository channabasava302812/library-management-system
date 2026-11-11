const express = require('express');
const router = express.Router();
const { getMembers, createMember } = require('../controllers/memberController');

router.route('/').get(getMembers).post(createMember);

module.exports = router;