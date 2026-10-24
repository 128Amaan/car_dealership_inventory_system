import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { email, isAdmin, token, logout } = useAuth();
  const nav = useNavigate();

  const linkCls = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
      isActive ? 'text-accent' : 'text-chrome/70 hover:text-chrome'
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-ink-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/15 ring-1 ring-accent/30 group-hover:bg-accent/25 transition">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-accent"><path d="M3 15c0-.8.7-1.5 1.5-1.5l1.6-3.8A2 2 0 0 1 8 8.3h8a2 2 0 0 1 1.9 1.4l1.6 3.8c.8 0 1.5.7 1.5 1.5v4h-2v-1H5v1H3v-4zm3.6-3.5 1-2.4h6.8l1 2.4H6.6zM6 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm12 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold text-chrome">VELOCITY</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-accent/80">motors · inventory</div>
          </div>
        </Link>

        {token && (
          <nav className="hidden gap-1 md:flex">
            <NavLink to="/" className={linkCls} end>Showroom</NavLink>
            {isAdmin && <NavLink to="/admin" className={linkCls}>Admin</NavLink>}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {token ? (
            <>
              <div className="hidden text-right text-xs md:block">
                <div className="text-chrome">{email}</div>
                <div className="text-[10px] uppercase tracking-wider text-chrome/50">
                  {isAdmin ? 'admin' : 'buyer'}
                </div>
              </div>
              <button
                className="btn-ghost"
                onClick={() => { logout(); nav('/login'); }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-accent">Create account</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
