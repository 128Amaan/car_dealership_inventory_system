import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, explainError } from '../api';
import { useAuth } from '../context/AuthContext';
import { AuthShell } from './Login';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault(); setErr(null); setBusy(true);
    try {
      await api.post('/auth/register', { email, password, is_admin: isAdmin });
      const { data } = await api.post('/auth/login', { email, password });
      login(data.access_token);
      nav('/', { replace: true });
    } catch (e) {
      setErr(explainError(e, 'The registrar declined your entry.'));
    } finally { setBusy(false); }
  }

  return (
    <AuthShell
      pretitle="Baldwin & Co. · open an account"
      title="New ledger."
      subtitle="Patrons receive a line in the ledger. Floor managers receive the keys."
    >
      <form onSubmit={submit} className="grid gap-6">
        <label className="block">
          <span className="label">Preferred email</span>
          <input className="input" required type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <span className="label">Choose a pass-code (6+ characters)</span>
          <input className="input" required type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
        </label>

        {/* Role selector: not a checkbox at the bottom. Two document-stamped choices. */}
        <div>
          <span className="label">Account class</span>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <RoleTile active={!isAdmin}  onClick={() => setIsAdmin(false)}
                      title="Patron"    body="Browse, filter, purchase." />
            <RoleTile active={isAdmin}   onClick={() => setIsAdmin(true)}
                      title="Floor mgr" body="Keys to add, amend, restock, strike." />
          </div>
        </div>

        {err && <div className="border border-rust px-3 py-2 text-sm text-rust font-mono">{err}</div>}
        <div className="flex items-center justify-between pt-4 border-t border-ink">
          <Link to="/login" className="punch text-ink hover:text-rust transition">[ already enrolled ]</Link>
          <button className="btn-ink" disabled={busy}>{busy ? 'Filing…' : 'File my entry'}</button>
        </div>
      </form>
    </AuthShell>
  );
}

function RoleTile({ active, onClick, title, body }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left px-3 py-3 border transition
        ${active
          ? 'bg-ink text-paper border-ink'
          : 'bg-transparent text-ink border-ink/40 hover:border-ink'}
      `}
      style={{ borderRadius: 0 }}
    >
      <span className={`punch block ${active ? 'text-paper/70' : 'text-mute'}`}>
        {active ? '◉ selected' : '○ class'}
      </span>
      <span className="font-display italic font-bold text-xl block leading-none mt-1">{title}</span>
      <span className={`text-[11px] block mt-2 ${active ? 'text-paper/80' : 'text-mute'}`}>{body}</span>
    </button>
  );
}
