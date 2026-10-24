import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { AuthShell } from './Login';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setBusy(true);
    try {
      await api.post('/auth/register', { email, password, is_admin: isAdmin });
      const { data } = await api.post('/auth/login', { email, password });
      login(data.access_token);
      nav('/', { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? 'Registration failed');
    } finally { setBusy(false); }
  }

  return (
    <AuthShell title="Join the showroom" subtitle="Register to browse and purchase vehicles.">
      <form onSubmit={submit} className="grid gap-4">
        <div><label className="label">Email</label><input className="input" required type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div><label className="label">Password (min 6 chars)</label><input className="input" required type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} /></div>
        <label className="flex items-center gap-2 text-sm text-chrome/70">
          <input type="checkbox" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} className="h-4 w-4 rounded accent-accent" />
          Register as admin (can create/edit/delete/restock)
        </label>
        {err && <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">{err}</div>}
        <button className="btn-accent" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        <p className="text-center text-sm text-chrome/60">
          Already registered? <Link to="/login" className="text-accent hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
