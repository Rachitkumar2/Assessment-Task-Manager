import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard'},
    { path: '/projects', label: 'Projects' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-ds-surface border-r border-ds-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-ds-border">
        <h1 className="text-lg font-semibold text-ds-text-primary font-[var(--font-headline)]">Team Task Manager</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-ds-cyan text-ds-base'
                    : 'text-ds-text-secondary hover:bg-ds-surface-hover hover:text-ds-text-primary'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-ds-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded bg-ds-cyan text-ds-base flex items-center justify-center text-sm font-medium">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ds-text-primary truncate">{user?.name}</p>
            <p className="text-xs text-ds-text-muted truncate">{user?.email}</p>
            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded font-[var(--font-mono)] ${user?.role === 'Admin' ? 'bg-ds-cyan-dim text-ds-cyan' : 'bg-ds-blue-dim text-ds-blue'}`}>{user?.role}</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 text-sm text-ds-text-secondary hover:bg-ds-surface-hover hover:text-ds-text-primary rounded transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
