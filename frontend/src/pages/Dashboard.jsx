import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { VehicleRow } from '../components/VehicleRow';
import { Modal } from '../components/Modal';
import { VehicleForm } from '../components/VehicleForm';

const EMPTY_SEARCH = { make: '', model: '', category: '', min: '', max: '' };

// Today's date in a dealer-plate format: "WED · 24.X.26"
function stamp() {
  const d = new Date();
  const day = ['SUN','MON','TUE','WED','THU','FRI','SAT'][d.getDay()];
  const month = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][d.getMonth()];
  const yy = String(d.getFullYear()).slice(-2);
  return `${day} · ${String(d.getDate()).padStart(2,'0')}.${month}.${yy}`;
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
    <div className="mx-auto max-w-[1360px] px-6 lg:px-10">

      {/* ───────── Masthead ───────── */}
      <section className="pt-10 lg:pt-16 pb-8 border-b border-ink">
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-9">
            <div className="punch text-mute mb-5">
              folio vi · {stamp()} · showroom floor
            </div>
            <h1 className="font-display font-black italic text-ink leading-[0.85] text-manifest">
              The&nbsp;Manifest.
            </h1>
            <p className="mt-6 max-w-xl text-ink text-base lg:text-lg leading-snug">
              Every automobile presently on the floor, in order of entry. Prices firm.
              <span className="italic text-mute"> Trade-ins by appointment only.</span>
            </p>
          </div>

          <div className="col-span-12 lg:col-span-3">
            <dl className="grid grid-cols-2 lg:grid-cols-1 gap-y-4">
              <StatLine label="listings on floor" value={stats.total} />
              <StatLine label="units in stock"    value={stats.units} />
              <StatLine label="asking (floor)"    value={`$${(stats.value/1000).toFixed(1)}k`} />
              <StatLine label="sold out"          value={stats.sold} tone="rust" />
            </dl>
          </div>
        </div>
      </section>

      {/* ───────── Search / search bar as a form card ───────── */}
      <section className="pt-6 pb-2 border-b border-ink">
        <div className="flex items-center gap-6 mb-4">
          <span className="punch text-mute">query the register</span>
          <div className="rule flex-1" />
        </div>
        <div className="grid grid-cols-12 gap-x-6 gap-y-3 items-end">
          <SearchField   label="Make"     value={filters.make}     onChange={v => setFilters(f => ({...f, make:v}))} />
          <SearchField   label="Model"    value={filters.model}    onChange={v => setFilters(f => ({...f, model:v}))} />
          <SearchField   label="Category" value={filters.category} onChange={v => setFilters(f => ({...f, category:v}))} />
          <SearchField   label="min $"    type="number" value={filters.min} onChange={v => setFilters(f => ({...f, min:v}))} />
          <SearchField   label="max $"    type="number" value={filters.max} onChange={v => setFilters(f => ({...f, max:v}))} />
          <div className="col-span-12 lg:col-span-2 flex gap-2 justify-end">
            <button className="btn-wire" onClick={() => setFilters(EMPTY_SEARCH)}>Clear</button>
            {isAdmin && <button className="btn-ink" onClick={() => setCreating(true)}>+ Add entry</button>}
          </div>
        </div>
      </section>

      {/* ───────── The Manifest ───────── */}
      <section className="pb-24">
        {err && <div className="my-6 border border-rust px-4 py-3 text-rust font-mono text-sm">{err}</div>}
        {loading ? (
          <div className="pt-10 pb-20 text-center punch text-mute animate-pulse">
            opening the register ·  ·  ·
          </div>
        ) : vehicles.length === 0 ? (
          <div className="py-24 text-center">
            <div className="font-display italic text-ink text-4xl">
              No entries match this query.
            </div>
            <div className="punch text-mute mt-3">
              clear the filters, or add the first vehicle.
            </div>
          </div>
        ) : (
          <div>
            {vehicles.map((v, i) => (
              <VehicleRow
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
            {/* Final hairline close */}
            <div className="border-t border-ink mt-0 pt-5 flex justify-between punch text-mute">
              <span>end of folio vi</span>
              <span>— baldwin &amp; co · plate 0012-NY</span>
            </div>
          </div>
        )}
      </section>

      {/* ─────────── Modals ─────────── */}
      <Modal open={creating} onClose={() => setCreating(false)} title="New entry to the register">
        <VehicleForm onSubmit={createVehicle} onCancel={() => setCreating(false)} submitLabel="File entry" />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Amend entry">
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
          <div className="flex justify-between items-center border-t border-ink pt-4">
            <span className="punch text-mute">entered against lot</span>
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

/* ─── Masthead stats ─── */
function StatLine({ label, value, tone }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-hair pb-1">
      <span className="punch text-mute">{label}</span>
      <span className={`odo text-2xl font-bold ${tone === 'rust' ? 'text-rust' : 'text-ink'}`}>
        {value}
      </span>
    </div>
  );
}

/* ─── Search field ─── */
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
