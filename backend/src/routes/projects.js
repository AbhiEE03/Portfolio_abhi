const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const router = express.Router();

router.get('/', getProjects);
router.post('/', authMiddleware, createProject);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

module.exports = router;
