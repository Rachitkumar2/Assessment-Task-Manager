import { useState } from 'react';

const AddMemberModal = ({ onSubmit, onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(email, role);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-ds-surface border border-ds-border rounded w-full max-w-sm mx-4">
        <div className="flex items-center justify-between p-5 border-b border-ds-border">
          <h3 className="text-lg font-semibold text-ds-text-primary">Add Member</h3>
          <button
            onClick={onClose}
            className="text-ds-text-muted hover:text-ds-text-primary text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="text-sm text-ds-error bg-ds-error-bg border border-ds-error/30 rounded p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ds-text-secondary mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ds-border rounded px-3 py-2 text-sm bg-ds-base text-ds-text-primary focus:outline-none focus:border-ds-cyan focus:shadow-[0_0_0_1px_var(--color-ds-cyan)] placeholder-ds-text-muted"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ds-text-secondary mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-ds-border rounded px-3 py-2 text-sm bg-ds-base text-ds-text-primary focus:outline-none focus:border-ds-cyan focus:shadow-[0_0_0_1px_var(--color-ds-cyan)]"
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
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
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
