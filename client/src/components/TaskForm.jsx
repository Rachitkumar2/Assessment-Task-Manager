import { useState, useEffect } from 'react';

const TaskForm = ({ task, members, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'To Do',
    dueDate: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        assignedTo: task.assignedTo?._id || '',
        status: task.status || 'To Do',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      assignedTo: formData.assignedTo || null,
      dueDate: formData.dueDate || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-ds-surface border border-ds-border rounded w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-5 border-b border-ds-border">
          <h3 className="text-lg font-semibold text-ds-text-primary">
            {task ? 'Edit Task' : 'Create Task'}
          </h3>
          <button
            onClick={onClose}
            className="text-ds-text-muted hover:text-ds-text-primary text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ds-text-secondary mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-ds-border rounded px-3 py-2 text-sm bg-ds-base text-ds-text-primary focus:outline-none focus:border-ds-cyan focus:shadow-[0_0_0_1px_var(--color-ds-cyan)] placeholder-ds-text-muted"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ds-text-secondary mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full border border-ds-border rounded px-3 py-2 text-sm bg-ds-base text-ds-text-primary focus:outline-none focus:border-ds-cyan focus:shadow-[0_0_0_1px_var(--color-ds-cyan)] placeholder-ds-text-muted resize-none"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ds-text-secondary mb-1">
              Assign To
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) =>
                setFormData({ ...formData, assignedTo: e.target.value })
              }
              className="w-full border border-ds-border rounded px-3 py-2 text-sm bg-ds-base text-ds-text-primary focus:outline-none focus:border-ds-cyan focus:shadow-[0_0_0_1px_var(--color-ds-cyan)]"
            >
              <option value="">Unassigned</option>
              {members?.map((m) => (
                <option key={m.user._id} value={m.user._id}>
                  {m.user.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ds-text-secondary mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full border border-ds-border rounded px-3 py-2 text-sm bg-ds-base text-ds-text-primary focus:outline-none focus:border-ds-cyan focus:shadow-[0_0_0_1px_var(--color-ds-cyan)]"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ds-text-secondary mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              onClick={(e) => e.target.showPicker?.()}
              className="w-full border border-ds-border rounded px-3 py-2 text-sm bg-ds-base text-ds-text-primary focus:outline-none focus:border-ds-cyan focus:shadow-[0_0_0_1px_var(--color-ds-cyan)] cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-ds-text-secondary bg-transparent border border-ds-border rounded hover:bg-ds-surface-hover transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-ds-base bg-ds-cyan rounded hover:brightness-110 transition-all cursor-pointer"
            >
              {task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
