import StatusBadge from './StatusBadge';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, isAdmin }) => {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  const priorityBorderColor = isOverdue
    ? 'border-l-red-500'
    : task.status === 'Done'
    ? 'border-l-ds-success'
    : task.status === 'In Progress'
    ? 'border-l-ds-warning'
    : 'border-l-ds-border';

  return (
    <div className={`bg-ds-surface border border-ds-border border-l-2 ${priorityBorderColor} rounded p-4 hover:bg-ds-surface-hover transition-colors`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-ds-text-primary truncate">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-ds-text-secondary mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <StatusBadge status={task.status} />
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-ds-text-muted font-[var(--font-mono)]">
        {task.assignedTo && (
          <span>Assigned to: {task.assignedTo.name}</span>
        )}
        {task.dueDate && (
          <span className={isOverdue ? 'text-ds-error font-medium' : ''}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
            {isOverdue && ' (Overdue)'}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        {/* Status change dropdown — available to both Admin and assigned Member */}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="text-xs border border-ds-border rounded px-2 py-1 bg-ds-base text-ds-text-secondary focus:outline-none focus:border-ds-cyan focus:shadow-[0_0_0_1px_var(--color-ds-cyan)]"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        {isAdmin && (
          <>
            <button
              onClick={() => onEdit(task)}
              className="text-xs text-ds-text-secondary hover:text-ds-text-primary px-2 py-1 rounded border border-ds-border hover:border-ds-text-muted transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-xs text-ds-error hover:text-ds-error px-2 py-1 rounded border border-ds-error/30 hover:bg-ds-error-bg transition-colors cursor-pointer"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
