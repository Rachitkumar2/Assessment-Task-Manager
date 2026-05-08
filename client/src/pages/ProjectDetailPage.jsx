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

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-ds-text-muted">Loading...</p></div>;
  if (!project) return <div className="flex items-center justify-center h-64"><p className="text-ds-text-muted">Project not found</p></div>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button onClick={() => navigate('/projects')} className="text-sm text-ds-text-muted hover:text-ds-cyan mb-2 inline-block cursor-pointer">&larr; Back to Projects</button>
          <h2 className="text-xl font-semibold text-ds-text-primary">{project.name}</h2>
          {project.description && <p className="text-sm text-ds-text-secondary mt-1">{project.description}</p>}
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button onClick={() => setShowEditProject(true)} className="px-3 py-1.5 text-sm text-ds-text-secondary border border-ds-border rounded hover:bg-ds-surface-hover hover:text-ds-text-primary cursor-pointer">Edit</button>
            <button onClick={handleDeleteProject} className="px-3 py-1.5 text-sm text-ds-error border border-ds-error/30 rounded hover:bg-ds-error-bg cursor-pointer">Delete</button>
          </div>
        )}
      </div>

      {/* Edit Project Modal */}
      {showEditProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-ds-surface border border-ds-border rounded w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-5 border-b border-ds-border">
              <h3 className="text-lg font-semibold text-ds-text-primary">Edit Project</h3>
              <button onClick={() => setShowEditProject(false)} className="text-ds-text-muted hover:text-ds-text-primary text-xl cursor-pointer">×</button>
            </div>
            <form onSubmit={handleUpdateProject} className="p-5 space-y-4">
              {error && <div className="text-sm text-ds-error bg-ds-error-bg rounded p-3">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-ds-text-secondary mb-1">Name *</label>
                <input type="text" required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full border border-ds-border rounded px-3 py-2 text-sm bg-ds-base text-ds-text-primary focus:outline-none focus:border-ds-cyan focus:shadow-[0_0_0_1px_var(--color-ds-cyan)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ds-text-secondary mb-1">Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} className="w-full border border-ds-border rounded px-3 py-2 text-sm bg-ds-base text-ds-text-primary focus:outline-none focus:border-ds-cyan focus:shadow-[0_0_0_1px_var(--color-ds-cyan)] resize-none" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditProject(false)} className="px-4 py-2 text-sm text-ds-text-secondary border border-ds-border rounded hover:bg-ds-surface-hover cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-ds-base bg-ds-cyan rounded hover:brightness-110 transition-all cursor-pointer">Save</button>
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
              <h3 className="text-sm font-medium text-ds-text-primary">Tasks ({tasks.length})</h3>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-xs border border-ds-border rounded px-2 py-1 bg-ds-base text-ds-text-secondary focus:outline-none focus:border-ds-cyan">
                <option value="">All</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            {isAdmin && (
              <button onClick={() => setShowTaskForm(true)} className="px-3 py-1.5 text-sm font-medium text-ds-base bg-ds-cyan rounded hover:brightness-110 transition-all cursor-pointer">+ Add Task</button>
            )}
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-ds-surface border border-ds-border rounded">
              <p className="text-sm text-ds-text-muted">No tasks found</p>
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
            <h3 className="text-sm font-medium text-ds-text-primary">Members ({project.members?.length})</h3>
            {isAdmin && (
              <button onClick={() => setShowAddMember(true)} className="text-xs text-ds-cyan font-medium hover:underline cursor-pointer">+ Add</button>
            )}
          </div>
          <div className="bg-ds-surface border border-ds-border rounded divide-y divide-ds-border">
            {project.members?.map((m) => (
              <div key={m.user._id || m.user} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-ds-cyan text-ds-base flex items-center justify-center text-xs font-medium">
                    {m.user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ds-text-primary">{m.user.name}</p>
                    <p className="text-xs text-ds-text-muted">{m.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-[var(--font-mono)] ${m.role === 'Admin' ? 'bg-ds-cyan-dim text-ds-cyan' : 'bg-ds-blue-dim text-ds-blue'}`}>{m.role}</span>
                  {isAdmin && m.role !== 'Admin' && (
                    <button onClick={() => handleRemoveMember(m.user._id)} className="text-xs text-ds-error hover:text-ds-error cursor-pointer">Remove</button>
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
