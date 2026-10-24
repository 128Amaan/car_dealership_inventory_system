import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  async function submit(e) {
    e.preventDefault(); setErr(null); setBusy(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.access_token);
      nav(loc.state?.from ?? '/', { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.detail ?? 'Login failed');
    } finally { setBusy(false); }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to the showroom.">
      <form onSubmit={submit} className="grid gap-4">
        <div><label className="label">Email</label><input className="input" required type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div><label className="label">Password</label><input className="input" required type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
        {err && <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">{err}</div>}
        <button className="btn-accent" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="text-center text-sm text-chrome/60">
          New here? <Link to="/register" className="text-accent hover:underline">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="relative isolate flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-6 py-12">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute -top-40 right-10 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="font-display text-3xl font-bold text-chrome">{title}</h1>
          <p className="mt-2 text-sm text-chrome/60">{subtitle}</p>
        </div>
        <div className="card p-6">{children}</div>
      </div>
    </div>
  );
}
