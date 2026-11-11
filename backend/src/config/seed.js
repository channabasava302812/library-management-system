const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('../models/Book');
const Member = require('../models/Member');
const IssueTransaction = require('../models/IssueTransaction');
const User = require('../models/User');

dotenv.config({ path: './.env' });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await Book.deleteMany();
    await Member.deleteMany();
    await IssueTransaction.deleteMany();
    await User.deleteMany();

    // 1. Seed Admin User
    await User.create({
      name: 'Admin Librarian',
      email: 'admin@library.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('👤 Admin User Created: admin@library.com / admin123');

    // 2. Seed Members
    const members = await Member.insertMany([
      { name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', membershipId: 'LIB-101' },
      { name: 'Priya Patel', email: 'priya@example.com', phone: '9876543211', membershipId: 'LIB-102' },
      { name: 'Amit Kumar', email: 'amit@example.com', phone: '9876543212', membershipId: 'LIB-103' },
    ]);

    // 3. Seed Books
    const books = await Book.insertMany([
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        category: 'Technology',
        totalQuantity: 5,
        availableQuantity: 4,
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt & David Thomas',
        isbn: '9780201616224',
        category: 'Technology',
        totalQuantity: 3,
        availableQuantity: 2,
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '9780735211292',
        category: 'Philosophy',
        totalQuantity: 4,
        availableQuantity: 4,
      },
      {
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Erich Gamma et al.',
        isbn: '9780201633610',
        category: 'Technology',
        totalQuantity: 2,
        availableQuantity: 0,
      },
    ]);

    // 4. Seed an Overdue Transaction
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 2);

    const pastIssueDate = new Date();
    pastIssueDate.setDate(pastIssueDate.getDate() - 9);

    await IssueTransaction.create({
      book: books[0]._id,
      member: members[0]._id,
      issueDate: pastIssueDate,
      dueDate: yesterday,
      status: 'ISSUED',
      fineAmount: 20,
    });

    console.log('✅ Demo Seed Data with Admin Inserted Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();