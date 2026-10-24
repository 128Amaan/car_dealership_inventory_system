import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, explainError } from '../api';
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
      setErr(explainError(e, 'Credentials refused.'));
    } finally { setBusy(false); }
  }

  return (
    <AuthShell
      pretitle="Baldwin & Co. · staff & patrons"
      title="Return visit."
      subtitle="State your name and the register will open."
    >
      <form onSubmit={submit} className="grid gap-6">
        <label className="block">
          <span className="label">Patron email</span>
          <input className="input" required type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <span className="label">Pass-code</span>
          <input className="input" required type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        {err && <div className="border border-rust px-3 py-2 text-sm text-rust font-mono">{err}</div>}
        <div className="flex items-center justify-between pt-4 border-t border-ink">
          <Link to="/register" className="punch text-ink hover:text-rust transition">[ open an account ]</Link>
          <button className="btn-ink" disabled={busy}>{busy ? 'Opening…' : 'Open the register'}</button>
        </div>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ pretitle, title, subtitle, children }) {
  return (
    <div className="mx-auto max-w-[1360px] px-6 lg:px-10 pt-16 lg:pt-24 pb-24">
      <div className="grid grid-cols-12 gap-10">
        {/* Giant left column — editorial */}
        <aside className="col-span-12 lg:col-span-6 lg:sticky lg:top-24 self-start">
          <div className="punch text-mute mb-4">{pretitle}</div>
          <h1 className="font-display italic font-black text-ink leading-[0.85] text-[clamp(3rem,8vw,7rem)]">
            {title}
          </h1>
          <p className="mt-6 text-ink text-lg max-w-md leading-snug">{subtitle}</p>

          {/* a little hairline chart / signature block */}
          <div className="mt-10 border-t border-ink pt-4">
            <div className="punch text-mute">floor hours</div>
            <div className="mt-2 flex items-baseline gap-4">
              <span className="font-display font-black text-ink text-3xl">09.00</span>
              <span className="odo text-mute">—</span>
              <span className="font-display font-black text-ink text-3xl">19.00</span>
              <span className="punch text-mute ml-2">tue–sat</span>
            </div>
          </div>
        </aside>

        {/* Right: the form, as a bordered deposit slip */}
        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <div className="plate p-8 lg:p-10 relative">
            {/* corner marks like a cut-here receipt */}
            <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Corner({ pos }) {
  const map = {
    tl: '-top-px -left-px border-t-2 border-l-2',
    tr: '-top-px -right-px border-t-2 border-r-2',
    bl: '-bottom-px -left-px border-b-2 border-l-2',
    br: '-bottom-px -right-px border-b-2 border-r-2',
  };
  return <span className={`absolute w-4 h-4 border-ink ${map[pos]}`} />;
}
