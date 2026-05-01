import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import AddMemberModal from '../components/AddMemberModal';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  const isAdmin = project?.members?.find(
    (m) => m.user._id === user?._id || m.user === user?._id
  )?.role === 'Admin';

  const fetchData = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/projects/${id}/tasks`),
      ]);
      setProject(projRes.data);
      setTasks(taskRes.data);
      setEditForm({ name: projRes.data.name, description: projRes.data.description || '' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleCreateTask = async (formData) => {
    try {
      await API.post(`/projects/${id}/tasks`, formData);
      setShowTaskForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleEditTask = async (formData) => {
    try {
      await API.patch(`/projects/${id}/tasks/${editingTask._id}`, formData);
      setEditingTask(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/projects/${id}/tasks/${taskId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/projects/${id}/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAddMember = async (email, role) => {
    await API.post(`/projects/${id}/members`, { email, role });
    fetchData();
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await API.delete(`/projects/${id}/members/${userId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      await API.patch(`/projects/${id}`, editForm);
      setShowEditProject(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await API.delete(`/projects/${id}`);
      navigate('/projects');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  const filteredTasks = statusFilter
    ? tasks.filter((t) => t.status === statusFilter)
    : tasks;

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Loading...</p></div>;
  if (!project) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Project not found</p></div>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button onClick={() => navigate('/projects')} className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">&larr; Back to Projects</button>
          <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
          {project.description && <p className="text-sm text-gray-500 mt-1">{project.description}</p>}
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button onClick={() => setShowEditProject(true)} className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Edit</button>
            <button onClick={handleDeleteProject} className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50">Delete</button>
          </div>
        )}
      </div>

      {/* Edit Project Modal */}
      {showEditProject && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Project</h3>
              <button onClick={() => setShowEditProject(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <form onSubmit={handleUpdateProject} className="p-5 space-y-4">
              {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditProject(false)} className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-gray-900 rounded-lg hover:bg-gray-800">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-medium text-gray-900">Tasks ({tasks.length})</h3>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700">
                <option value="">All</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            {isAdmin && (
              <button onClick={() => setShowTaskForm(true)} className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">+ Add Task</button>
            )}
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-500">No tasks found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  isAdmin={isAdmin}
                  onEdit={(t) => setEditingTask(t)}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Members Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Members ({project.members?.length})</h3>
            {isAdmin && (
              <button onClick={() => setShowAddMember(true)} className="text-xs text-gray-900 font-medium hover:underline">+ Add</button>
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {project.members?.map((m) => (
              <div key={m.user._id || m.user} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-medium">
                    {m.user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{m.user.name}</p>
                    <p className="text-xs text-gray-500">{m.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${m.role === 'Admin' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}>{m.role}</span>
                  {isAdmin && m.role !== 'Admin' && (
                    <button onClick={() => handleRemoveMember(m.user._id)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTaskForm && <TaskForm members={project.members} onSubmit={handleCreateTask} onClose={() => setShowTaskForm(false)} />}
      {editingTask && <TaskForm task={editingTask} members={project.members} onSubmit={handleEditTask} onClose={() => setEditingTask(null)} />}
      {showAddMember && <AddMemberModal onSubmit={handleAddMember} onClose={() => setShowAddMember(false)} />}
    </div>
  );
};

export default ProjectDetailPage;
