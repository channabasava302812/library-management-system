const Book = require('../models/Book');
const IssueTransaction = require('../models/IssueTransaction');

// 1. Create a new Book
exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, totalQuantity } = req.body;

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ success: false, message: 'Book with this ISBN already exists' });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      totalQuantity: Number(totalQuantity),
      availableQuantity: Number(totalQuantity), // Initially available = total
    });

    res.status(201).json({ success: true, data: book, message: 'Book registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get all Books with Search, Filters, and Pagination
exports.getBooks = async (req, res) => {
  try {
    const { search = '', category = '', availability = 'all', page = 1, limit = 5 } = req.query;

    const query = {};

    // Search by title, author, or ISBN (case-insensitive)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    // Category Filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Availability Filter
    if (availability === 'available') {
      query.availableQuantity = { $gt: 0 };
    } else if (availability === 'out_of_stock') {
      query.availableQuantity = { $eq: 0 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalBooks = await Book.countDocuments(query);
    const books = await Book.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum);

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        totalBooks,
        totalPages: Math.ceil(totalBooks / limitNum) || 1,
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Update Book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, category, totalQuantity } = req.body;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Check if new totalQuantity is valid against currently issued copies
    const issuedCount = book.totalQuantity - book.availableQuantity;
    if (Number(totalQuantity) < issuedCount) {
      return res.status(400).json({
        success: false,
        message: `Cannot set total quantity below ${issuedCount} (number of currently issued copies)`,
      });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.category = category || book.category;

    if (totalQuantity !== undefined) {
      const difference = Number(totalQuantity) - book.totalQuantity;
      book.totalQuantity = Number(totalQuantity);
      book.availableQuantity += difference;
    }

    await book.save();
    res.status(200).json({ success: true, data: book, message: 'Book updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Delete Book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if there are active unreturned issues for this book
    const activeIssue = await IssueTransaction.findOne({ book: id, status: 'ISSUED' });
    if (activeIssue) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete book: Copies are currently issued to members',
      });
    }

    await Book.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};