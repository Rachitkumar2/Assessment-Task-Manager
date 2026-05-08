const StatusBadge = ({ status }) => {
  const styles = {
    'To Do': 'bg-ds-text-muted/15 text-ds-text-secondary',
    'In Progress': 'bg-ds-warning-bg text-ds-warning',
    Done: 'bg-ds-success-bg text-ds-success',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium font-[var(--font-mono)] ${
        styles[status] || 'bg-ds-text-muted/15 text-ds-text-secondary'
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
