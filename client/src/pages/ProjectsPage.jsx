import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    API.get('/projects').then(({ data }) => setProjects(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await API.post('/projects', formData);
      setShowCreate(false);
      setFormData({ name: '', description: '' });
      navigate(`/projects/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-ds-text-muted">Loading...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-ds-text-primary">Projects</h2>
          <p className="text-sm text-ds-text-muted mt-1">Manage your team projects</p>
        </div>
        {isAdmin && <button onClick={() => setShowCreate(true)} className="px-4 py-2 text-sm font-medium text-ds-base bg-ds-cyan rounded hover:brightness-110 transition-all cursor-pointer">+ New Project</button>}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-ds-surface border border-ds-border rounded w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-5 border-b border-ds-border">
              <h3 className="text-lg font-semibold text-ds-text-primary">Create Project</h3>
              <button onClick={() => { setShowCreate(false); setError(''); }} className="text-ds-text-muted hover:text-ds-text-primary text-xl cursor-pointer">×</button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              {error && <div className="text-sm text-ds-error bg-ds-error-bg border border-ds-error/30 rounded p-3">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-ds-text-secondary mb-1">Project Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-ds-border rounded px-3 py-2 text-sm bg-ds-base text-ds-text-primary focus:outline-none focus:border-ds-cyan focus:shadow-[0_0_0_1px_var(--color-ds-cyan)] placeholder-ds-text-muted" placeholder="Enter project name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ds-text-secondary mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full border border-ds-border rounded px-3 py-2 text-sm bg-ds-base text-ds-text-primary focus:outline-none focus:border-ds-cyan focus:shadow-[0_0_0_1px_var(--color-ds-cyan)] placeholder-ds-text-muted resize-none" placeholder="Enter project description" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreate(false); setError(''); }} className="px-4 py-2 text-sm font-medium text-ds-text-secondary bg-transparent border border-ds-border rounded hover:bg-ds-surface-hover cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-ds-base bg-ds-cyan rounded hover:brightness-110 transition-all cursor-pointer">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-ds-text-muted mb-4">No projects yet</p>
          {isAdmin && <button onClick={() => setShowCreate(true)} className="text-sm text-ds-cyan font-medium hover:underline cursor-pointer">Create your first project</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Link key={p._id} to={`/projects/${p._id}`} className="bg-ds-surface border border-ds-border rounded p-5 hover:bg-ds-surface-hover hover:border-ds-border-hover transition-colors">
              <h3 className="text-sm font-medium text-ds-text-primary">{p.name}</h3>
              {p.description && <p className="text-sm text-ds-text-secondary mt-1 line-clamp-2">{p.description}</p>}
              <div className="mt-4 flex items-center gap-4 text-xs text-ds-text-muted font-[var(--font-mono)]">
                <span>{p.members?.length || 0} members</span>
                <span>Owner: {p.owner?.name}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
