const IssueTransaction = require('../models/IssueTransaction');
const Book = require('../models/Book');
const Member = require('../models/Member');

const FINE_PER_DAY = Number(process.env.FINE_PER_DAY) || 10;

// 1. Issue a Book
exports.issueBook = async (req, res) => {
  try {
    const { bookId, memberId, dueDate, remarks } = req.body;

    if (!bookId || !memberId || !dueDate) {
      return res.status(400).json({ success: false, message: 'Book, Member, and Due Date are required' });
    }

    // 1. Verify Book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // 2. Prevent issuing if available copies = 0
    if (book.availableQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: `Book "${book.title}" is out of stock. Cannot issue.`,
      });
    }

    // 3. Verify Member
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // 4. Prevent duplicate active issuance of the exact same book to the same member
    const existingActive = await IssueTransaction.findOne({
      book: bookId,
      member: memberId,
      status: 'ISSUED',
    });
    if (existingActive) {
      return res.status(400).json({
        success: false,
        message: 'Member already has an active issue of this book',
      });
    }

    // 5. Create transaction and decrement available copies
    const transaction = await IssueTransaction.create({
      book: bookId,
      member: memberId,
      issueDate: new Date(),
      dueDate: new Date(dueDate),
      remarks: remarks || '',
      status: 'ISSUED',
      fineAmount: 0,
    });

    book.availableQuantity -= 1;
    await book.save();

    res.status(201).json({
      success: true,
      data: transaction,
      message: `Book successfully issued to ${member.name}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Return a Book & Calculate Late Fine
exports.returnBook = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await IssueTransaction.findById(id).populate('book member');
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction record not found' });
    }

    if (transaction.status === 'RETURNED') {
      return res.status(400).json({ success: false, message: 'Book has already been returned' });
    }

    const returnDate = new Date();
    const dueDate = new Date(transaction.dueDate);

    // Calculate late fine
    let fineAmount = 0;
    if (returnDate > dueDate) {
      const diffTime = Math.abs(returnDate - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fineAmount = diffDays * FINE_PER_DAY;
    }

    transaction.status = 'RETURNED';
    transaction.returnDate = returnDate;
    transaction.fineAmount = fineAmount;
    await transaction.save();

    // Increment available book quantity
    const book = await Book.findById(transaction.book._id);
    if (book) {
      book.availableQuantity += 1;
      await book.save();
    }

    res.status(200).json({
      success: true,
      data: transaction,
      message: `Book returned successfully. Late fine: ₹${fineAmount}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get all Issue Transactions with Overdue highlight & Pagination
exports.getTransactions = async (req, res) => {
  try {
    const { status = 'ALL', search = '', page = 1, limit = 5 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (status !== 'ALL') {
      filter.status = status;
    }

    const rawTransactions = await IssueTransaction.find(filter)
      .populate('book', 'title isbn author category')
      .populate('member', 'name email membershipId phone')
      .sort({ createdAt: -1 });

    const now = new Date();

    // Process overdue status & dynamic fine calculation for active issues
    let processed = rawTransactions.map((tx) => {
      const item = tx.toObject();
      const isOverdue = item.status === 'ISSUED' && now > new Date(item.dueDate);

      let currentFine = item.fineAmount;
      if (isOverdue) {
        const diffTime = Math.abs(now - new Date(item.dueDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        currentFine = diffDays * FINE_PER_DAY;
      }

      return {
        ...item,
        isOverdue,
        calculatedFine: currentFine,
      };
    });

    // Apply optional search filter across populated fields
    if (search) {
      const term = search.toLowerCase();
      processed = processed.filter(
        (t) =>
          t.book?.title?.toLowerCase().includes(term) ||
          t.book?.isbn?.toLowerCase().includes(term) ||
          t.member?.name?.toLowerCase().includes(term) ||
          t.member?.membershipId?.toLowerCase().includes(term)
      );
    }

    const totalCount = processed.length;
    const paginatedData = processed.slice(skip, skip + limitNum);

    res.status(200).json({
      success: true,
      data: paginatedData,
      pagination: {
        totalRecords: totalCount,
        totalPages: Math.ceil(totalCount / limitNum) || 1,
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};