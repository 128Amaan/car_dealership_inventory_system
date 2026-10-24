import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, explainError } from '../api';
import { useAuth } from '../context/AuthContext';
import { CarDiagram } from '../components/CarDiagram';

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
      setErr(explainError(e, 'Credentials refused.'));
    } finally { setBusy(false); }
  }

  return (
    <AuthShell
      formNo="MR-1A"
      pretitle="Access the register"
      title="Return visit."
      subtitle="State your credentials. The register will open to the current issue."
    >
      <form onSubmit={submit} className="grid gap-5">
        <Field label="Patron email">
          <input className="input" required type="email" autoComplete="email"
                 value={email} onChange={e => setEmail(e.target.value)} />
        </Field>
        <Field label="Pass-code">
          <input className="input" required type="password" autoComplete="current-password"
                 value={password} onChange={e => setPassword(e.target.value)} />
        </Field>
        {err && <div className="border-2 border-signal px-3 py-2 text-sm text-signal font-mono">{err}</div>}
        <div className="flex items-center justify-between pt-3 border-t-2 border-ink">
          <Link to="/register" className="punch text-ink hover:text-signal transition">[ open an account ]</Link>
          <button className="btn-ink" disabled={busy}>{busy ? 'Opening…' : 'Open register'}</button>
        </div>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ formNo, pretitle, title, subtitle, children }) {
  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-10 lg:pt-16 pb-24 grid grid-cols-12 gap-8">

      {/* LEFT — publication-style editorial half */}
      <aside className="col-span-12 lg:col-span-7 lg:sticky lg:top-24 self-start">
        <div className="flex items-center gap-3 mb-5 punch text-mute">
          <span className="vin-plate">FORM&nbsp;{formNo}</span>
          <span>— {pretitle}</span>
          <div className="rule flex-1" />
        </div>

        <h1 className="font-din font-black text-ink uppercase leading-[0.85] text-[clamp(3rem,9vw,7rem)] tracking-tight">
          {title}
        </h1>
        <p className="mt-5 text-ink text-base lg:text-lg max-w-xl leading-snug">{subtitle}</p>

        {/* Fine-print spec block — Haynes manual lower-margin */}
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-2 max-w-md">
          <SpecLine k="FLOOR HOURS" v="TUE – SAT · 09:00–19:00" />
          <SpecLine k="REGISTRAR"  v="M. Baldwin · plate 0012-NY" />
          <SpecLine k="TITLES"      v="all in-hand · no liens" />
          <SpecLine k="TRADE-INS"   v="by appointment" />
        </div>

        <div className="mt-10 border-t-2 border-ink pt-4 max-w-md">
          <div className="punch text-mute mb-2">fig. 1 — showroom reference drawing</div>
          <CarDiagram className="w-full h-auto text-ink" />
        </div>
      </aside>

      {/* RIGHT — the form itself, as a bordered form block */}
      <div className="col-span-12 lg:col-span-5">
        <div className="plate relative p-7 lg:p-9" style={{boxShadow:'3px 3px 0 0 var(--ink)'}}>
          <div className="absolute -top-3 left-6 bg-paper px-2 punch">section&nbsp;·&nbsp;a</div>
          {children}
          <div className="mt-6 pt-3 border-t border-dashed punch text-mute flex justify-between" style={{borderColor:'var(--rule)'}}>
            <span>signed by registrar on receipt</span>
            <span>page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

function SpecLine({ k, v }) {
  return (
    <>
      <div className="punch text-mute border-b border-dotted pb-1" style={{borderColor:'var(--rule)'}}>{k}</div>
      <div className="font-mono text-[12px] text-ink border-b border-dotted pb-1" style={{borderColor:'var(--rule)'}}>{v}</div>
    </>
  );
}
