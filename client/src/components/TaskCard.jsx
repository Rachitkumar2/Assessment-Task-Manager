import StatusBadge from './StatusBadge';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, isAdmin }) => {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <StatusBadge status={task.status} />
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        {task.assignedTo && (
          <span>Assigned to: {task.assignedTo.name}</span>
        )}
        {task.dueDate && (
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
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
          className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        {isAdmin && (
          <>
            <button
              onClick={() => onEdit(task)}
              className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
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
