import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await API.get('/dashboard');
        setData(data);
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Failed to load dashboard</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Projects', value: data.totalProjects, color: 'bg-white' },
    { label: 'Total Tasks', value: data.totalTasks, color: 'bg-white' },
    { label: 'My Tasks', value: data.myTasks, color: 'bg-white' },
    { label: 'Overdue', value: data.overdueTasks, color: data.overdueTasks > 0 ? 'bg-red-50' : 'bg-white' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Overview of your projects and tasks</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} border border-gray-200 rounded-lg p-5`}
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Task Status Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(data.statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusBadge status={status} />
                </div>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Your Projects</h3>
          {data.projects.length === 0 ? (
            <p className="text-sm text-gray-500">No projects yet</p>
          ) : (
            <div className="space-y-2">
              {data.projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">{project.name}</span>
                  <span className="text-xs text-gray-500">
                    {project.members?.length || 0} members
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overdue Tasks */}
      {data.overdueTasksList && data.overdueTasksList.length > 0 && (
        <div className="bg-white border border-red-200 rounded-lg p-5 mb-8">
          <h3 className="text-sm font-medium text-red-700 mb-4">
            Overdue Tasks ({data.overdueTasksList.length})
          </h3>
          <div className="space-y-3">
            {data.overdueTasksList.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-500">
                    {task.project?.name} • Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={task.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Tasks</h3>
        {data.recentTasks.length === 0 ? (
          <p className="text-sm text-gray-500">No tasks yet</p>
        ) : (
          <div className="space-y-2">
            {data.recentTasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                  <p className="text-xs text-gray-500">
                    {task.project?.name}
                    {task.assignedTo && ` • ${task.assignedTo.name}`}
                  </p>
                </div>
                <StatusBadge status={task.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
