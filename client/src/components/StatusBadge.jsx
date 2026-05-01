const StatusBadge = ({ status }) => {
  const styles = {
    'To Do': 'bg-gray-100 text-gray-700',
    'In Progress': 'bg-blue-50 text-blue-700',
    Done: 'bg-green-50 text-green-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        styles[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
