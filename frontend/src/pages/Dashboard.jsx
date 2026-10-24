import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { CollectorPoster } from '../components/CollectorPoster';
import { Modal } from '../components/Modal';
import { VehicleForm } from '../components/VehicleForm';

const EMPTY_SEARCH = { make: '', model: '', category: '', min: '', max: '' };

function printStamp() {
  const d = new Date();
  const y = String(d.getFullYear()).slice(-2);
  const m = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${dd}/${m}/${y}`;
}

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [filters, setFilters] = useState(EMPTY_SEARCH);
  const [busyId, setBusyId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [restocking, setRestocking] = useState(null);
  const [restockAmt, setRestockAmt] = useState(1);

  const load = useCallback(async () => {
    setLoading(true); setErr(null);
    try {
      const hasFilter = Object.values(filters).some(Boolean);
      const url = hasFilter ? '/vehicles/search' : '/vehicles';
      const params = {};
      if (hasFilter) {
        if (filters.make) params.make = filters.make;
        if (filters.model) params.model = filters.model;
        if (filters.category) params.category = filters.category;
        if (filters.min) params.min_price = filters.min;
        if (filters.max) params.max_price = filters.max;
      }
      const { data } = await api.get(url, { params });
      setVehicles(data);
    } catch (e) {
      setErr(e?.response?.data?.detail ?? 'The register is unreachable.');
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  async function purchase(id) {
    setBusyId(id);
    try {
      const { data } = await api.post(`/vehicles/${id}/purchase`);
      setVehicles(xs => xs.map(v => v.id === id ? data : v));
    } catch (e) { alert(e?.response?.data?.detail ?? 'Purchase refused'); }
    finally { setBusyId(null); }
  }

  async function remove(id) {
    if (!confirm('Strike this entry from the register?')) return;
    setBusyId(id);
    try { await api.delete(`/vehicles/${id}`); setVehicles(xs => xs.filter(v => v.id !== id)); }
    catch (e) { alert(e?.response?.data?.detail ?? 'Could not strike'); }
    finally { setBusyId(null); }
  }

  async function createVehicle(form) {
    const { data } = await api.post('/vehicles', form);
    setVehicles(xs => [data, ...xs]);
    setCreating(false);
  }

  async function updateVehicle(form) {
    if (!editing) return;
    const { data } = await api.put(`/vehicles/${editing.id}`, form);
    setVehicles(xs => xs.map(v => v.id === editing.id ? data : v));
    setEditing(null);
  }

  async function doRestock() {
    if (!restocking) return;
    try {
      const { data } = await api.post(`/vehicles/${restocking.id}/restock`, { amount: restockAmt });
      setVehicles(xs => xs.map(v => v.id === restocking.id ? data : v));
      setRestocking(null); setRestockAmt(1);
    } catch (e) { alert(e?.response?.data?.detail ?? 'Restock refused'); }
  }

  const stats = useMemo(() => ({
    total: vehicles.length,
    units: vehicles.reduce((s, v) => s + v.quantity, 0),
    value: vehicles.reduce((s, v) => s + v.quantity * v.price, 0),
    sold:  vehicles.filter(v => v.quantity <= 0).length,
  }), [vehicles]);

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-10">

      {/* ─────────── Masthead — spec-sheet publication header ─────────── */}
      <section className="pt-8 pb-5 border-b-2 border-ink">
        <div className="punch text-mute flex items-center gap-4 flex-wrap">
          <span>Vol. 6</span><span>·</span>
          <span>Issue 24</span><span>·</span>
          <span>Printed {printStamp()}</span><span>·</span>
          <span>Baldwin &amp; Co. — Pre-Owned Automobile Register</span>
        </div>
        <div className="mt-4 grid grid-cols-12 gap-6 items-end">
          <h1 className="col-span-12 lg:col-span-8 font-din font-black text-ink uppercase leading-[0.85] text-[clamp(3rem,8vw,8rem)] tracking-tight">
            Heritage&nbsp;Collection
          </h1>
          <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-x-5 gap-y-2">
            <StatRow label="listings"       value={stats.total} />
            <StatRow label="units in stock" value={stats.units} />
            <StatRow label="floor asking"   value={`$${(stats.value/1000).toFixed(1)}k`} />
            <StatRow label="sold out"       value={stats.sold} tone="signal" />
          </div>
        </div>
      </section>

      {/* ─────────── Query bar ─────────── */}
      <section className="pt-5 pb-4 border-b border-ink">
        <div className="flex items-center gap-4 mb-3">
          <span className="punch text-mute">query the register</span>
          <div className="rule flex-1" />
        </div>
        <div className="grid grid-cols-12 gap-x-5 gap-y-3 items-end">
          <SearchField label="Make"     value={filters.make}     onChange={v => setFilters(f => ({...f, make:v}))} />
          <SearchField label="Model"    value={filters.model}    onChange={v => setFilters(f => ({...f, model:v}))} />
          <SearchField label="Category" value={filters.category} onChange={v => setFilters(f => ({...f, category:v}))} />
          <SearchField label="min $"    type="number" value={filters.min} onChange={v => setFilters(f => ({...f, min:v}))} />
          <SearchField label="max $"    type="number" value={filters.max} onChange={v => setFilters(f => ({...f, max:v}))} />
          <div className="col-span-12 lg:col-span-2 flex gap-2 justify-end">
            <button className="btn-wire" onClick={() => setFilters(EMPTY_SEARCH)}>Clear</button>
            {isAdmin && <button className="btn-ink" onClick={() => setCreating(true)}>+ Print poster</button>}
          </div>
        </div>
      </section>

      {/* ─────────── Grid of window stickers ─────────── */}
      <section className="pt-8 pb-24">
        {err && <div className="my-4 border-2 border-signal px-4 py-3 text-signal font-mono text-sm">{err}</div>}

        {loading ? (
          <div className="grid grid-cols-1 gap-10">
            {Array.from({length: 2}).map((_, i) => <div key={i} className="poster h-[800px] animate-pulse" />)}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="py-20 text-center plate p-10">
            <div className="font-din font-black text-ink text-5xl uppercase">No matches on floor.</div>
            <div className="punch text-mute mt-3">clear the filters, or print a new poster.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-14">
            {vehicles.map((v, i) => (
              <CollectorPoster
                key={v.id}
                vehicle={v}
                index={i}
                isAdmin={isAdmin}
                busy={busyId === v.id}
                onPurchase={() => purchase(v.id)}
                onEdit={() => setEditing(v)}
                onDelete={() => remove(v.id)}
                onRestock={() => { setRestocking(v); setRestockAmt(1); }}
              />
            ))}
          </div>
        )}

        <div className="mt-10 border-t-2 border-ink pt-4 flex justify-between punch text-mute">
          <span>end of issue 24 · {vehicles.length}&nbsp;posters printed</span>
          <span>Baldwin &amp; Co. · plate 0012-NY</span>
        </div>
      </section>

      {/* ─────────── Modals ─────────── */}
      <Modal open={creating} onClose={() => setCreating(false)} title="New sticker — vehicle intake">
        <VehicleForm onSubmit={createVehicle} onCancel={() => setCreating(false)} submitLabel="Print sticker" />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Amend sticker">
        <VehicleForm initial={editing ?? undefined} onSubmit={updateVehicle} onCancel={() => setEditing(null)} submitLabel="File amendment" />
      </Modal>
      <Modal
        open={!!restocking}
        onClose={() => setRestocking(null)}
        title={restocking ? `Restock — ${restocking.make} ${restocking.model}` : ''}
      >
        <div className="grid gap-5">
          <label className="block">
            <span className="label">Units received</span>
            <input className="input" type="number" min={1} value={restockAmt} onChange={e => setRestockAmt(Number(e.target.value))} />
          </label>
          <div className="flex justify-between items-center border-t-2 border-ink pt-4">
            <span className="punch text-mute">receipt against lot</span>
            <div className="flex gap-2">
              <button className="btn-wire" onClick={() => setRestocking(null)}>Cancel</button>
              <button className="btn-ink" onClick={doRestock}>Record receipt</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ─── Masthead stat row — one line, hairline underline ─── */
function StatRow({ label, value, tone }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dotted" style={{borderColor: 'var(--rule)'}}>
      <span className="punch text-mute">{label}</span>
      <span className={`font-din font-black text-2xl tabular-nums ${tone === 'signal' ? 'text-signal' : 'text-ink'}`}>
        {value}
      </span>
    </div>
  );
}

/* ─── Search field — simple hairline input ─── */
function SearchField({ label, value, onChange, type = 'text' }) {
  return (
    <label className="col-span-6 lg:col-span-2 block">
      <span className="label">{label}</span>
      <input
        className="input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
