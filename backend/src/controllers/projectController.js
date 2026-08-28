const Project = require('../models/Project');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    return res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error.message);
    return res.status(400).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json(updated);
  } catch (error) {
    console.error('Update project error:', error.message);
    return res.status(400).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error.message);
    return res.status(500).json({ message: 'Failed to delete project' });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
