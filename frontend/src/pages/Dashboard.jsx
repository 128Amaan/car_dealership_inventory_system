import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { VehicleCard } from '../components/VehicleCard';
import { Modal } from '../components/Modal';
import { VehicleForm } from '../components/VehicleForm';

const EMPTY_SEARCH = { make: '', model: '', category: '', min: '', max: '' };

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
      setErr(e?.response?.data?.detail ?? 'Failed to load vehicles');
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  async function purchase(id) {
    setBusyId(id);
    try {
      const { data } = await api.post(`/vehicles/${id}/purchase`);
      setVehicles(xs => xs.map(v => v.id === id ? data : v));
    } catch (e) { alert(e?.response?.data?.detail ?? 'Purchase failed'); }
    finally { setBusyId(null); }
  }

  async function remove(id) {
    if (!confirm('Delete this vehicle?')) return;
    setBusyId(id);
    try { await api.delete(`/vehicles/${id}`); setVehicles(xs => xs.filter(v => v.id !== id)); }
    catch (e) { alert(e?.response?.data?.detail ?? 'Delete failed'); }
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
    } catch (e) { alert(e?.response?.data?.detail ?? 'Restock failed'); }
  }

  const stats = useMemo(() => ({
    total: vehicles.length,
    units: vehicles.reduce((s, v) => s + v.quantity, 0),
    value: vehicles.reduce((s, v) => s + v.quantity * v.price, 0),
  }), [vehicles]);

  return (
    <div className="relative isolate">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 grid-bg opacity-25" />
        <div className="absolute -right-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-accent/25 blur-3xl animate-float" />
        <div className="relative mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="chip border border-accent/30 bg-accent/10 text-accent">live inventory</span>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-chrome md:text-5xl">
                The showroom, <span className="text-accent">reimagined</span>.
              </h1>
              <p className="mt-3 max-w-xl text-sm text-chrome/60">
                Browse every vehicle in stock, filter by make, model, category or price,
                and complete a purchase in a single click.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Listings" value={stats.total} />
              <StatTile label="Units" value={stats.units} />
              <StatTile label="Lot Value" value={`$${(stats.value/1000).toFixed(0)}k`} />
            </div>
          </div>

          <div className="card mt-10 p-4 md:p-5">
            <div className="grid gap-3 md:grid-cols-6">
              <input className="input md:col-span-1" placeholder="Make"     value={filters.make}     onChange={e => setFilters(f => ({...f, make: e.target.value}))} />
              <input className="input md:col-span-1" placeholder="Model"    value={filters.model}    onChange={e => setFilters(f => ({...f, model: e.target.value}))} />
              <input className="input md:col-span-1" placeholder="Category" value={filters.category} onChange={e => setFilters(f => ({...f, category: e.target.value}))} />
              <input className="input md:col-span-1" type="number" placeholder="Min $" value={filters.min} onChange={e => setFilters(f => ({...f, min: e.target.value}))} />
              <input className="input md:col-span-1" type="number" placeholder="Max $" value={filters.max} onChange={e => setFilters(f => ({...f, max: e.target.value}))} />
              <div className="flex gap-2 md:col-span-1">
                <button className="btn-ghost flex-1" onClick={() => setFilters(EMPTY_SEARCH)}>Clear</button>
                {isAdmin && <button className="btn-accent flex-1" onClick={() => setCreating(true)}>+ Add</button>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {err && <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/30">{err}</div>}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({length: 6}).map((_, i) => <div key={i} className="card h-56 animate-pulse" />)}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="card grid place-items-center p-16 text-center text-chrome/60">
            <div className="text-5xl">🚗</div>
            <p className="mt-3">No vehicles match your filters.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map(v => (
              <VehicleCard
                key={v.id}
                vehicle={v}
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
      </section>

      <Modal open={creating} onClose={() => setCreating(false)} title="Add vehicle">
        <VehicleForm onSubmit={createVehicle} onCancel={() => setCreating(false)} submitLabel="Create" />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit vehicle">
        <VehicleForm initial={editing ?? undefined} onSubmit={updateVehicle} onCancel={() => setEditing(null)} submitLabel="Save changes" />
      </Modal>
      <Modal open={!!restocking} onClose={() => setRestocking(null)} title={`Restock ${restocking?.make ?? ''} ${restocking?.model ?? ''}`}>
        <div className="grid gap-4">
          <div>
            <label className="label">Add units</label>
            <input className="input" type="number" min={1} value={restockAmt} onChange={e => setRestockAmt(Number(e.target.value))} />
          </div>
          <div className="flex justify-end gap-2">
            <button className="btn-ghost" onClick={() => setRestocking(null)}>Cancel</button>
            <button className="btn-accent" onClick={doRestock}>Add to stock</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="card px-4 py-3">
      <div className="text-[10px] uppercase tracking-widest text-chrome/50">{label}</div>
      <div className="mt-1 font-display text-xl font-bold text-chrome tabular-nums">{value}</div>
    </div>
  );
}
