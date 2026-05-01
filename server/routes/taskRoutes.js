const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { requireAdmin, requireMember } = require('../middleware/role');

// All routes require authentication
router.use(protect);

// POST /api/projects/:projectId/tasks — Create task (Admin only)
router.post('/:projectId/tasks', requireAdmin, createTask);

// GET /api/projects/:projectId/tasks — List tasks (any member)
router.get('/:projectId/tasks', requireMember, getTasks);

// GET /api/projects/:projectId/tasks/:id — Get single task (any member)
router.get('/:projectId/tasks/:id', requireMember, getTask);

// PATCH /api/projects/:projectId/tasks/:id — Update task (Admin: all, Member: status only)
router.patch('/:projectId/tasks/:id', requireMember, updateTask);

// DELETE /api/projects/:projectId/tasks/:id — Delete task (Admin only)
router.delete('/:projectId/tasks/:id', requireAdmin, deleteTask);

module.exports = router;
