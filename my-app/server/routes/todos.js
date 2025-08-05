const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Todo = require('../models/todo');

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// GET /api/todos → Get all todos of the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  const todos = await Todo.find({ userId: req.user.userId });
  res.json(todos);
});

// POST /api/todos → Create a new todo
router.post('/', authMiddleware, async (req, res) => {
  const { text } = req.body;
  const todo = new Todo({
    text,
    completed: false,
    userId: req.user.userId
  });
  await todo.save();
  res.status(201).json(todo);
});

// PUT /api/todos/:id → Update a todo (toggle completed)
router.put('/:id', authMiddleware, async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    { completed: req.body.completed },
    { new: true }
  );
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// DELETE /api/todos/:id → Delete a todo
router.delete('/:id', authMiddleware, async (req, res) => {
  const result = await Todo.deleteOne({ _id: req.params.id, userId: req.user.userId });
  if (result.deletedCount === 0) return res.status(404).json({ error: 'Todo not found' });
  res.json({ message: 'Todo deleted' });
});

module.exports = router;
