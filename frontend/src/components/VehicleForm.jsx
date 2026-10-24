import { useEffect, useState } from 'react';

const EMPTY = {
  make: '', model: '', category: 'sedan',
  price: 20000, quantity: 1, year: new Date().getFullYear(), image_url: null,
};

export function VehicleForm({ initial, onSubmit, onCancel, submitLabel = 'Save' }) {
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
      setErr(e?.response?.data?.detail ?? 'Something went wrong');
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
      <div><label className="label">Make</label>    <input className="input" required value={v.make} onChange={upd('make')} /></div>
      <div><label className="label">Model</label>   <input className="input" required value={v.model} onChange={upd('model')} /></div>
      <div>
        <label className="label">Category</label>
        <select className="input" value={v.category} onChange={upd('category')}>
          {['sedan','suv','truck','coupe','hatchback','ev','convertible'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div><label className="label">Year</label>    <input className="input" type="number" value={v.year ?? ''} onChange={upd('year')} /></div>
      <div><label className="label">Price (USD)</label><input className="input" type="number" min={0} value={v.price} onChange={upd('price')} /></div>
      <div><label className="label">Quantity</label><input className="input" type="number" min={0} value={v.quantity} onChange={upd('quantity')} /></div>
      {err && <div className="md:col-span-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">{err}</div>}
      <div className="md:col-span-2 flex justify-end gap-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-accent" disabled={busy}>{busy ? 'Saving…' : submitLabel}</button>
      </div>
    </form>
  );
}
