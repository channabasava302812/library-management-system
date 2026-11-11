const express = require('express');
const router = express.Router();
const { createBook, getBooks, updateBook, deleteBook } = require('../controllers/bookController');

router.route('/').get(getBooks).post(createBook);
router.route('/:id').put(updateBook).delete(deleteBook);

module.exports = router;