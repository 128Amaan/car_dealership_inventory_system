import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Spec-sheet publication header. Masthead left, nav + credentials right.
// No icons, no logo mark. The wordmark + plate number is the brand.
export function Navbar() {
  const { email, isAdmin, token, logout } = useAuth();
  const nav = useNavigate();

  const linkCls = ({ isActive }) =>
    `relative pb-0.5 text-[11px] font-mono tracking-punch uppercase ${
      isActive ? 'text-ink' : 'text-mute hover:text-ink'
    } ${isActive ? "after:absolute after:left-0 after:right-0 after:-bottom-px after:h-[2px] after:bg-signal" : ''}`;

  return (
    <header className="sticky top-0 z-30 bg-paper border-b-2 border-ink">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-3 flex items-end justify-between gap-6">
        <Link to="/" className="group leading-none">
          <div className="flex items-baseline gap-3">
            <span className="font-din font-black text-ink text-[26px] md:text-[32px] leading-none uppercase tracking-tight">
              Baldwin&nbsp;&amp;&nbsp;Co.
            </span>
            <span className="punch hidden md:inline text-mute">
              reg. plate 0012-NY · est. 1973
            </span>
          </div>
          <div className="punch text-mute mt-1">pre-owned automobile register · spec-sheet press</div>
        </Link>

        <nav className="flex items-center gap-5 pb-1">
          {token ? (
            <>
              <NavLink to="/" end className={linkCls}>Floor</NavLink>
              {isAdmin && <NavLink to="/admin" className={linkCls}>Backshop</NavLink>}
              <span className="punch text-mute hidden md:inline border-l border-ink/40 pl-5">
                {isAdmin ? 'floor manager' : 'buyer'} · {email}
              </span>
              <button
                className="punch text-ink hover:text-signal transition"
                onClick={() => { logout(); nav('/login'); }}
              >
                [ sign off ]
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="punch text-ink hover:text-signal transition">[ sign in ]</Link>
              <Link to="/register" className="btn-ink">Open account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
