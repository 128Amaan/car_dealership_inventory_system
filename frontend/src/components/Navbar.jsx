import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Deliberate choice: no logo mark, no icon. The wordmark + the serial
// number IS the brand. Reads as a filing-cabinet header, not a navbar.
export function Navbar() {
  const { email, isAdmin, token, logout } = useAuth();
  const nav = useNavigate();

  const linkCls = ({ isActive }) =>
    `relative pb-1 text-[11px] font-mono tracking-punch uppercase ${
      isActive ? 'text-ink' : 'text-mute hover:text-ink'
    } ${isActive ? "after:absolute after:left-0 after:right-0 after:-bottom-px after:h-[2px] after:bg-rust" : ''}`;

  return (
    <header className="sticky top-0 z-30 bg-paper border-b border-ink">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10 py-3 flex items-end justify-between gap-6">
        <Link to="/" className="group leading-none">
          <div className="flex items-baseline gap-3">
            <span className="font-display font-black italic text-ink text-[28px] md:text-[34px] leading-none">
              Baldwin&nbsp;&amp;&nbsp;Co.
            </span>
            <span className="punch hidden md:inline text-mute">
              est. 1973 · plate&nbsp;0012-NY
            </span>
          </div>
          <div className="punch text-mute mt-1">pre-owned automobile register</div>
        </Link>

        <nav className="flex items-center gap-6 pb-1">
          {token ? (
            <>
              <NavLink to="/" end className={linkCls}>Manifest</NavLink>
              {isAdmin && <NavLink to="/admin" className={linkCls}>Backshop</NavLink>}
              <span className="punch text-mute hidden md:inline border-l border-hair pl-6">
                {isAdmin ? 'floor manager' : 'buyer'} · {email}
              </span>
              <button
                className="punch text-ink hover:text-rust transition"
                onClick={() => { logout(); nav('/login'); }}
              >
                [ sign off ]
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="punch text-ink hover:text-rust transition">[ sign in ]</Link>
              <Link to="/register" className="btn-ink">Open an account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
