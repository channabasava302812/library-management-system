import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
});

// Auth API
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (userData) => API.post('/auth/register', userData);

// Books API
export const fetchBooks = (params) => API.get('/books', { params });
export const createBook = (data) => API.post('/books', data);
export const updateBook = (id, data) => API.put(`/books/${id}`, data);
export const deleteBook = (id) => API.delete(`/books/${id}`);

// Issues API
export const fetchTransactions = (params) => API.get('/issues', { params });
export const issueBook = (data) => API.post('/issues', data);
export const returnBook = (id) => API.put(`/issues/${id}/return`);

// Members API
export const fetchMembers = () => API.get('/members');
export const createMember = (data) => API.post('/members', data);

// Dashboard Stats API
export const fetchDashboardStats = () => API.get('/dashboard');

export default API;