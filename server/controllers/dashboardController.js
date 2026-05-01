const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard stats for the current user
// @route   GET /api/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    // Get all projects the user is a member of
    const projects = await Project.find({
      'members.user': req.user._id,
    }).populate('owner', 'name email');

    const projectIds = projects.map((p) => p._id);

    // Get all tasks in user's projects
    const allTasks = await Task.find({ project: { $in: projectIds } })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name');

    // Tasks assigned to the user
    const myTasks = allTasks.filter(
      (t) => t.assignedTo && t.assignedTo._id.toString() === req.user._id.toString()
    );

    // Status counts
    const statusCounts = {
      'To Do': 0,
      'In Progress': 0,
      Done: 0,
    };

    allTasks.forEach((t) => {
      statusCounts[t.status]++;
    });

    // Overdue tasks (due date in the past and not done)
    const now = new Date();
    const overdueTasks = allTasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Done'
    );

    res.json({
      totalProjects: projects.length,
      totalTasks: allTasks.length,
      myTasks: myTasks.length,
      statusCounts,
      overdueTasks: overdueTasks.length,
      overdueTasksList: overdueTasks,
      recentTasks: allTasks.slice(0, 10),
      projects,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboard };
