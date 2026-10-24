// The manifest row — this is the hero of the whole system.
// NOT a card. A hairline-ruled ledger entry.
// Left: lot number + model (Fraunces display).
// Middle: specs stacked monospace (VIN-style, year, category).
// Right: price (giant numerals), stock odometer, action buttons.

const palette = ['moss', 'rust', 'ink', 'moss', 'ink'];

// deterministic faux-VIN so each listing has an identity
function fakeVin(id) {
  const s = `BLDW${String(id).padStart(5, '0')}`;
  return `1HGCM${s}F28${(id * 7919 % 10000).toString().padStart(4, '0')}`;
}

export function VehicleRow({ vehicle, onPurchase, onEdit, onDelete, onRestock, isAdmin, busy, index }) {
  const outOfStock = vehicle.quantity <= 0;
  const lot = String(index + 1).padStart(3, '0');
  const accent = palette[vehicle.id % palette.length];

  return (
    <article className="group relative grid grid-cols-12 gap-6 py-7 lg:py-9 border-t border-ink">
      {/* Lot number — punched into the left margin */}
      <div className="col-span-12 lg:col-span-1 flex lg:flex-col items-start gap-2">
        <span className="punch text-mute">lot</span>
        <span className="font-mono text-[22px] font-bold text-ink leading-none">
          №{lot}
        </span>
      </div>

      {/* Make + Model — the big display moment */}
      <div className="col-span-12 lg:col-span-5">
        <div className="punch text-mute mb-2">{vehicle.category} · {vehicle.year ?? '—'}</div>
        <h3 className="font-display font-black text-ink leading-[0.9] text-[clamp(2rem,4vw,3.75rem)]">
          {vehicle.make}
        </h3>
        <h4 className="font-display italic font-medium text-ink leading-[0.95] text-[clamp(1.5rem,2.6vw,2.5rem)] mt-1">
          <span className={accent === 'rust' ? 'text-rust' : accent === 'moss' ? 'text-moss' : ''}>
            {vehicle.model}
          </span>
        </h4>
        <div className="mt-3 flex items-center gap-4 text-[11px] text-mute">
          <span>vin&nbsp;·&nbsp;<span className="text-ink">{fakeVin(vehicle.id)}</span></span>
        </div>
      </div>

      {/* Spec column — ledger */}
      <div className="col-span-6 lg:col-span-3">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
          <dt className="text-mute">drivetrain</dt><dd className="text-ink">FWD</dd>
          <dt className="text-mute">transmission</dt><dd className="text-ink">auto · 8-spd</dd>
          <dt className="text-mute">mileage</dt>
          <dd className="text-ink">{((vehicle.id * 7193) % 60000 + 2800).toLocaleString()}&nbsp;mi</dd>
          <dt className="text-mute">title</dt><dd className="text-ink">clean · in-hand</dd>
        </dl>
      </div>

      {/* Price + stock + actions */}
      <div className="col-span-6 lg:col-span-3 flex flex-col items-end justify-between gap-5">
        <div className="text-right">
          <div className="punch text-mute">asking</div>
          <div className="font-display font-black text-ink leading-none text-[clamp(2.25rem,4vw,3.75rem)]">
            ${vehicle.price.toLocaleString()}
          </div>
          <div className="mt-2">
            {outOfStock ? (
              /* The one rubber-stamp — our memorable moment */
              <span
                className="inline-block font-display italic font-black text-rust border-[3px] border-rust px-2 py-0.5 text-lg animate-stamp tracking-tighter"
                style={{ transform: 'rotate(-6deg)' }}
              >
                SOLD OUT
              </span>
            ) : (
              <span className="punch text-moss">
                in stock · <span className="odo text-ink text-sm">{String(vehicle.quantity).padStart(2, '0')}</span>&nbsp;units
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-2 w-full">
          <button
            className="btn-ink"
            onClick={onPurchase}
            disabled={outOfStock || busy}
            title={outOfStock ? 'Out of stock' : 'Purchase'}
          >
            {outOfStock ? '—' : 'Purchase'}
          </button>
          {isAdmin && (
            <>
              <button className="btn-wire" onClick={onRestock} disabled={busy}>+ Restock</button>
              <button className="btn-wire" onClick={onEdit} disabled={busy}>Edit</button>
              <button className="btn-danger" onClick={onDelete} disabled={busy}>Strike</button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
