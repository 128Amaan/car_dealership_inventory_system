import { CarDiagram } from './CarDiagram';

// Deterministic faux-data per vehicle id, so each sticker reads differently
// without hitting the backend. All derived from `id` so it stays stable
// between renders.
function derived(id) {
  const rng = (seed, mod) => ((id * seed) % mod);
  return {
    vin: `1HGCM${String(id).padStart(5,'0')}F${28000 + rng(7919, 10000)}`,
    stock: `BLD-${String(id).padStart(4,'0')}`,
    mpgCity: 18 + rng(13, 18),
    mpgHwy:  24 + rng(19, 22),
    length: (170 + rng(23, 30)).toFixed(1),
    width:  (71 + rng(5, 8)).toFixed(1),
    weight: (2800 + rng(37, 900)).toLocaleString(),
    engine: ['3.6L V6', '2.0T I4', '5.0L V8', '4.4L V8 TT', '1.5L I3 Hybrid', '6.2L V8'][id % 6],
    trans:  ['8-spd automatic', '7-spd DCT', '6-spd manual', 'CVT', '10-spd automatic'][id % 5],
    drive:  ['FWD', 'RWD', 'AWD', '4WD'][id % 4],
    color:  ['Alpine White', 'Jet Black', 'Guards Red', 'British Racing Green', 'Oxford Blue', 'Chrome Yellow'][id % 6],
    doors:  [2, 4][id % 2],
    seats:  [2, 4, 5, 7][id % 4],
    mileage: ((id * 7193) % 60000 + 2800).toLocaleString(),
  };
}

export function WindowSticker({
  vehicle, index, isAdmin, busy, onPurchase, onEdit, onDelete, onRestock,
}) {
  const d = derived(vehicle.id);
  const outOfStock = vehicle.quantity <= 0;
  const lot = String(index + 1).padStart(3, '0');

  return (
    <article className="sticker p-5">
      {/* ───── Header band ───── */}
      <header className="border-b-2 border-ink pb-3 mb-3 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="vin-plate">LOT № {lot}</span>
            <span className="vin-plate">{vehicle.year ?? '—'}</span>
            <span className="vin-plate">{String(vehicle.category).toUpperCase()}</span>
          </div>
          <h3 className="font-din font-black text-ink leading-[0.85] text-[clamp(1.75rem,3.6vw,3rem)] uppercase tracking-tight">
            {vehicle.make}
          </h3>
          <h4 className="font-din font-bold text-ink leading-[0.9] text-[clamp(1.1rem,2.2vw,1.6rem)] uppercase mt-1">
            {vehicle.model}
          </h4>
        </div>

        {/* Price box — red bordered, Monroney corner-of-sticker style */}
        <div className="relative shrink-0">
          <div className="punch text-mute text-right mb-1">asking price · USD</div>
          <div className="border-2 border-signal px-3 py-1">
            <div className="font-din font-black text-ink leading-none text-[clamp(1.8rem,3.4vw,3rem)] tabular-nums">
              ${vehicle.price.toLocaleString()}
            </div>
          </div>
          {outOfStock && (
            <span
              className="absolute -top-2 -right-2 animate-stamp inline-block
                         font-din italic font-black text-paper bg-signal
                         px-2 py-0.5 text-sm uppercase tracking-wide"
              style={{ transform: 'rotate(-6deg)' }}
            >
              Sold out
            </span>
          )}
        </div>
      </header>

      {/* ───── Body: 3 columns — diagram | spec table | EPA/stock panel ───── */}
      <div className="grid grid-cols-12 gap-5">

        {/* Left: patent-drawing car */}
        <div className="col-span-12 md:col-span-4 flex flex-col">
          <div className="punch text-mute mb-2">fig. 1 — side elevation</div>
          <CarDiagram className="w-full h-auto text-ink" />
          <div className="mt-3 flex items-center justify-between punch text-mute">
            <span>color</span>
            <span className="text-ink">{d.color}</span>
          </div>
          <div className="mt-1 flex items-center justify-between punch text-mute">
            <span>odometer</span>
            <span className="text-ink">{d.mileage}&nbsp;mi</span>
          </div>
        </div>

        {/* Middle: dense spec table (two columns of specs) */}
        <div className="col-span-12 md:col-span-5">
          <div className="punch text-mute mb-2">standard equipment · specifications</div>
          <div className="grid grid-cols-2 gap-x-6">
            <table className="spec-table">
              <tbody>
                <tr><th>Engine</th><td>{d.engine}</td></tr>
                <tr><th>Transmission</th><td>{d.trans}</td></tr>
                <tr><th>Drive</th><td>{d.drive}</td></tr>
                <tr><th>Doors</th><td>{d.doors}</td></tr>
              </tbody>
            </table>
            <table className="spec-table">
              <tbody>
                <tr><th>Length</th><td>{d.length}&nbsp;in</td></tr>
                <tr><th>Width</th><td>{d.width}&nbsp;in</td></tr>
                <tr><th>Curb wt.</th><td>{d.weight}&nbsp;lb</td></tr>
                <tr><th>Seating</th><td>{d.seats}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 pt-2 border-t border-dashed" style={{borderColor:'var(--rule)'}}>
            <table className="spec-table">
              <tbody>
                <tr><th>VIN</th><td className="tracking-wider">{d.vin}</td></tr>
                <tr><th>Stock no.</th><td>{d.stock}</td></tr>
                <tr><th>Title</th><td>Clean · in hand</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: EPA fuel panel + stock plate */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
          {/* EPA fuel-economy block — the yellow accent, used once */}
          <div className="epa-box px-3 py-2">
            <div className="font-din font-black text-ink leading-none text-[11px] uppercase">EPA · fuel economy</div>
            <div className="mt-1.5 flex items-end justify-between">
              <div>
                <div className="font-din font-black text-ink leading-none text-4xl tabular-nums">{d.mpgCity}</div>
                <div className="punch text-ink/80 mt-1">city mpg</div>
              </div>
              <div className="h-10 w-px bg-ink mx-2" />
              <div>
                <div className="font-din font-black text-ink leading-none text-4xl tabular-nums">{d.mpgHwy}</div>
                <div className="punch text-ink/80 mt-1">hwy mpg</div>
              </div>
            </div>
          </div>

          {/* Stock on floor */}
          <div className="plate px-3 py-2">
            <div className="punch text-mute">units on floor</div>
            <div className="font-din font-black text-ink leading-none text-4xl tabular-nums mt-1">
              {String(vehicle.quantity).padStart(2, '0')}
            </div>
            <div className={`punch mt-1 ${outOfStock ? 'text-signal' : 'text-ink'}`}>
              {outOfStock ? 'sold out · awaiting restock' : 'in stock · for sale'}
            </div>
          </div>
        </div>
      </div>

      {/* ───── Footer actions ───── */}
      <footer className="mt-5 pt-3 border-t-2 border-ink flex items-end justify-between gap-3">
        <div className="punch text-mute">
          Form MR-1 (rev. 03/26) · prepared by Baldwin &amp; Co. · plate 0012-NY
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button className="btn-ink" onClick={onPurchase} disabled={outOfStock || busy}>
            {outOfStock ? 'Awaiting restock' : 'Purchase'}
          </button>
          {isAdmin && (
            <>
              <button className="btn-wire"   onClick={onRestock} disabled={busy}>+ Restock</button>
              <button className="btn-wire"   onClick={onEdit}    disabled={busy}>Amend</button>
              <button className="btn-danger" onClick={onDelete}  disabled={busy}>Strike</button>
            </>
          )}
        </div>
      </footer>
    </article>
  );
}
