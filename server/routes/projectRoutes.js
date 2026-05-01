const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

// All routes require authentication
router.use(protect);

// POST /api/projects — Create project
router.post('/', createProject);

// GET /api/projects — List user's projects
router.get('/', getProjects);

// GET /api/projects/:id — Get single project
router.get('/:id', getProject);

// PATCH /api/projects/:id — Update project (Admin only)
router.patch('/:id', requireAdmin, updateProject);

// DELETE /api/projects/:id — Delete project (Admin only)
router.delete('/:id', requireAdmin, deleteProject);

// POST /api/projects/:id/members — Add member (Admin only)
router.post('/:id/members', requireAdmin, addMember);

// DELETE /api/projects/:id/members/:userId — Remove member (Admin only)
router.delete('/:id/members/:userId', requireAdmin, removeMember);

module.exports = router;
