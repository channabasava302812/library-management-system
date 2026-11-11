const express = require('express');
const router = express.Router();
const { issueBook, returnBook, getTransactions } = require('../controllers/issueController');

router.route('/').get(getTransactions).post(issueBook);
router.route('/:id/return').put(returnBook);

module.exports = router;