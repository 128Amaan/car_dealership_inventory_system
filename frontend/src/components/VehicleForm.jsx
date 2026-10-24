import { useEffect, useState } from 'react';

const EMPTY = {
  make: '', model: '', category: 'sedan',
  price: 20000, quantity: 1, year: new Date().getFullYear(), image_url: null,
};

export function VehicleForm({ initial, onSubmit, onCancel, submitLabel = 'File' }) {
  const [v, setV] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (initial) {
      const { id: _id, ...rest } = initial;
      setV(rest);
    } else {
      setV(EMPTY);
    }
  }, [initial]);

  const upd = (k) => (e) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setV((prev) => ({ ...prev, [k]: val }));
  };

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try { await onSubmit(v); } catch (e) {
      setErr(e?.response?.data?.detail ?? 'Rejected by registrar');
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
      <Field label="Make">     <input className="input" required value={v.make} onChange={upd('make')} /></Field>
      <Field label="Model">    <input className="input" required value={v.model} onChange={upd('model')} /></Field>
      <Field label="Category">
        <select className="input" value={v.category} onChange={upd('category')}>
          {['sedan','suv','truck','coupe','hatchback','ev','convertible'].map(c =>
            <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Model year"><input className="input" type="number" value={v.year ?? ''} onChange={upd('year')} /></Field>
      <Field label="Asking price (USD)"><input className="input" type="number" min={0} value={v.price} onChange={upd('price')} /></Field>
      <Field label="Units on floor"><input className="input" type="number" min={0} value={v.quantity} onChange={upd('quantity')} /></Field>

      {err && <div className="md:col-span-2 border border-rust px-3 py-2 text-sm text-rust font-mono">{err}</div>}

      <div className="md:col-span-2 flex justify-between items-center pt-4 mt-2 border-t border-ink">
        <span className="punch text-mute">signed by registrar on receipt</span>
        <div className="flex gap-2">
          <button type="button" className="btn-wire" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-ink" disabled={busy}>{busy ? 'Filing…' : submitLabel}</button>
        </div>
      </div>
    </form>
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
