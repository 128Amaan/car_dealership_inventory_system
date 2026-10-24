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
      formNo="MR-2"
      pretitle="New account application"
      title="New ledger."
      subtitle="Patrons receive a line in the ledger. Floor managers receive the keys."
    >
      <form onSubmit={submit} className="grid gap-5">
        <label className="block">
          <span className="label">Preferred email</span>
          <input className="input" required type="email" autoComplete="email"
                 value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <span className="label">Choose a pass-code (6+ characters)</span>
          <input className="input" required type="password" minLength={6} autoComplete="new-password"
                 value={password} onChange={e => setPassword(e.target.value)} />
        </label>

        <div>
          <span className="label">Account class</span>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <RoleTile active={!isAdmin} onClick={() => setIsAdmin(false)}
                      k="A" title="Patron"    body="Browse, filter, purchase stickers." />
            <RoleTile active={isAdmin}  onClick={() => setIsAdmin(true)}
                      k="B" title="Floor mgr." body="Keys to print, amend, restock, strike." />
          </div>
        </div>

        {err && <div className="border-2 border-signal px-3 py-2 text-sm text-signal font-mono">{err}</div>}
        <div className="flex items-center justify-between pt-3 border-t-2 border-ink">
          <Link to="/login" className="punch text-ink hover:text-signal transition">[ already enrolled ]</Link>
          <button className="btn-ink" disabled={busy}>{busy ? 'Filing…' : 'File entry'}</button>
        </div>
      </form>
    </AuthShell>
  );
}

function RoleTile({ active, onClick, k, title, body }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left px-3 py-3 border-2 transition rounded-none
        ${active
          ? 'bg-ink text-paper border-ink'
          : 'bg-transparent text-ink border-ink/40 hover:border-ink'}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-punch uppercase">
          class · {k}
        </span>
        <span className="font-mono text-[10px]">{active ? '◉' : '○'}</span>
      </div>
      <div className="font-din font-black uppercase text-2xl leading-none mt-1">{title}</div>
      <div className={`text-[11px] mt-2 font-mono ${active ? 'text-paper/80' : 'text-mute'}`}>{body}</div>
    </button>
  );
}
