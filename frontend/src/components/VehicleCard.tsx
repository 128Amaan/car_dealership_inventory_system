import type { Vehicle } from '../api';

const palette = ['from-orange-500/20', 'from-sky-500/20', 'from-emerald-500/20', 'from-violet-500/20', 'from-pink-500/20'];

export function VehicleCard({
  vehicle,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
  isAdmin,
  busy,
}: {
  vehicle: Vehicle;
  onPurchase: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRestock?: () => void;
  isAdmin: boolean;
  busy?: boolean;
}) {
  const tint = palette[vehicle.id % palette.length];
  const outOfStock = vehicle.quantity <= 0;

  return (
    <div className={`card group relative overflow-hidden`}>
      <div className={`absolute inset-x-0 -top-20 h-40 bg-gradient-to-b ${tint} to-transparent blur-2xl opacity-70 group-hover:opacity-100 transition`} />
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="chip">{vehicle.category}</span>
              {vehicle.year && <span className="chip">{vehicle.year}</span>}
            </div>
            <h3 className="mt-3 font-display text-xl font-bold text-chrome">
              {vehicle.make} <span className="text-accent">{vehicle.model}</span>
            </h3>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-bold text-chrome tabular-nums">
              ${vehicle.price.toLocaleString()}
            </div>
            <div className={`mt-1 text-xs font-semibold ${outOfStock ? 'text-red-400' : 'text-emerald-400'}`}>
              {outOfStock ? 'Out of stock' : `${vehicle.quantity} in stock`}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            className="btn-accent flex-1"
            onClick={onPurchase}
            disabled={outOfStock || busy}
            title={outOfStock ? 'Out of stock' : 'Purchase'}
          >
            {outOfStock ? 'Sold out' : 'Purchase'}
          </button>
          {isAdmin && (
            <>
              <button className="btn-ghost" onClick={onRestock} disabled={busy}>+ Restock</button>
              <button className="btn-ghost" onClick={onEdit} disabled={busy}>Edit</button>
              <button className="btn-danger" onClick={onDelete} disabled={busy}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
