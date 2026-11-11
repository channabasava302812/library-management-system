const Book = require('../models/Book');
const IssueTransaction = require('../models/IssueTransaction');
const Member = require('../models/Member');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalBooksCount = await Book.countDocuments();
    const books = await Book.find({}, 'totalQuantity availableQuantity');

    const totalCopies = books.reduce((acc, b) => acc + b.totalQuantity, 0);
    const availableCopies = books.reduce((acc, b) => acc + b.availableQuantity, 0);

    const activeIssues = await IssueTransaction.find({ status: 'ISSUED' });
    const totalIssued = activeIssues.length;

    const now = new Date();
    const overdueCount = activeIssues.filter((tx) => now > new Date(tx.dueDate)).length;

    const totalMembers = await Member.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalTitles: totalBooksCount,
        totalCopies,
        availableCopies,
        totalIssued,
        overdueCount,
        totalMembers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};