const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private (Admin only)
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      project: req.params.projectId,
      assignedTo: assignedTo || null,
      status: status || 'To Do',
      dueDate: dueDate || null,
      createdBy: req.user._id,
    });

    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private (members only)
const getTasks = async (req, res) => {
  try {
    const { status, assignedTo } = req.query;

    const filter = { project: req.params.projectId };
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single task
// @route   GET /api/projects/:projectId/tasks/:id
// @access  Private (members only)
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      project: req.params.projectId,
    })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a task (Admin: all fields, Member: only status)
// @route   PATCH /api/projects/:projectId/tasks/:id
// @access  Private (members)
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      project: req.params.projectId,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check role
    if (req.memberRole === 'Member') {
      // Members can only change status of tasks assigned to them
      if (
        !task.assignedTo ||
        task.assignedTo.toString() !== req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: 'You can only update status of tasks assigned to you' });
      }

      // Members can only change status
      if (req.body.status) {
        task.status = req.body.status;
      } else {
        return res
          .status(403)
          .json({ message: 'Members can only update task status' });
      }
    } else {
      // Admin can update all fields
      const { title, description, assignedTo, status, dueDate } = req.body;
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
      if (status) task.status = status;
      if (dueDate !== undefined) task.dueDate = dueDate;
    }

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/projects/:projectId/tasks/:id
// @access  Private (Admin only)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      project: req.params.projectId,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};
