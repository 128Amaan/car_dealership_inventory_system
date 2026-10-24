import {
  CarSideHero, CarFront, CarRear,
  EngineBlock, WheelDiagram, ChassisDiagram,
} from './CarViews';
import {
  Barcode, QrPlate, StarBar,
  IconDriveFR, IconTransmission, IconBrake, IconWheel, IconFlag, IconManual,
} from './MarkElements';

/* Deterministic faux-spec sheet per vehicle id so each poster is complete
   without extra backend fields. Stable between renders. */
function derive(id) {
  const r = (seed, mod) => ((id * seed) % mod);
  const engines = ['3.6L V6', '5.0L V8', '2.0T I4', '1.6L DOHC', '4.4L V8 TT', '7.0L V8'];
  const trans   = ['8-SPD AUTO', '5-SPD MANUAL', '7-SPD DCT', 'CVT', '10-SPD AUTO'];
  const drives  = ['FWD', 'RWD', 'AWD', '4WD'];
  const colors  = ['ETON BLUE', 'ALPINE WHITE', 'JET BLACK', 'GUARDS RED',
                   'BRITISH RACING GREEN', 'OXFORD BLUE', 'CHROME YELLOW'];
  const classes = ['P1', 'P2', 'GT', 'TOURER', 'HERITAGE', 'RALLY'];
  return {
    engine:   engines[id % engines.length],
    trans:    trans[id % trans.length],
    drive:    drives[id % drives.length],
    color:    colors[id % colors.length],
    perfClass: classes[id % classes.length],
    hp:       180 + r(53, 320),
    torque:   220 + r(37, 240),
    accel060: (4.8 + (r(11,40)/10)).toFixed(1),
    quarter:  (12.8 + (r(13,55)/10)).toFixed(1),
    weight:   (2600 + r(37, 1400)).toLocaleString(),
    length:   (170 + r(23, 32)).toFixed(1),
    wheelbase:(100 + r(17, 25)).toFixed(1),
    width:    (71 + r(5, 10)).toFixed(1),
    height:   (52 + r(7, 15)).toFixed(1),
    bore:     (3.6 + (r(11,10)/10)).toFixed(2),
    stroke:   (3.4 + (r(13,10)/10)).toFixed(2),
    disp:     (3200 + r(37, 2600)),
    compression: (9.0 + (r(5,20)/10)).toFixed(1),
    units:    (120_000 + r(41, 800_000)).toLocaleString(),
    vin:      `1HGCM${String(id).padStart(5,'0')}F${28000 + r(7919, 10000)}`,
    stock:    `BLD-${String(id).padStart(4,'0')}-NY`,
    mileage:  ((id * 7193) % 60000 + 2800).toLocaleString(),
    tagline:  ['Not just a car. A legend.',
               'Built for the road. Born to drive.',
               'The purest form of motion.',
               'Engineered with precision.',
               'Timeless by design.',
               'Legacy, in sheet metal.'][id % 6],
    builtIn:  ['DETROIT, MI, USA', 'STUTTGART, DE', 'TOYODA CITY, JP',
               'COVENTRY, UK', 'MUNICH, DE', 'MARANELLO, IT'][id % 6],
    firingOrder: '1-5-3-6-2-4',
  };
}

export function CollectorPoster({
  vehicle, index, isAdmin, busy, onPurchase, onEdit, onDelete, onRestock,
}) {
  const d = derive(vehicle.id);
  const outOfStock = vehicle.quantity <= 0;
  const lot = String(index + 1).padStart(3, '0');
  const docCode = `BLD-${String(vehicle.year ?? '00').slice(-2)}-${d.stock.split('-')[1]}`;

  return (
    <article className="poster">

      {/* ───────── Chevron warning band — top ───────── */}
      <div className="chevron-band h-3" />

      {/* ───────── Masthead row ───────── */}
      <header className="px-6 pt-5 pb-3 border-b-2 border-ink">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {/* Shield logo */}
            <div className="shrink-0 w-11 h-14 border-2 border-ink bg-paper flex items-center justify-center">
              <span className="font-din font-black text-ink text-lg leading-none">B&amp;Co</span>
            </div>
            <div>
              <div className="punch text-mute flex items-center gap-2 flex-wrap">
                <span className="vin-plate">HERITAGE SERIES</span>
                <span>·</span>
                <span>DOC {docCode}</span>
                <span>·</span>
                <span>LOT № {lot}</span>
              </div>
              <StarBar className="my-1.5 w-40" />
            </div>
          </div>

          {/* Year block + collector edition — top right */}
          <div className="shrink-0 text-right">
            <div className="punch text-mute">model year</div>
            <div className="font-din font-black text-ink text-3xl leading-none">
              {vehicle.year ?? '—'}
            </div>
            <div className="punch text-ink mt-1 border border-ink inline-block px-1.5 py-0.5">
              EDITION {String(vehicle.id).padStart(3,'0')} / 500
            </div>
          </div>
        </div>

        {/* MAKE / MODEL headline */}
        <div className="mt-4">
          <h2 className="font-din font-black uppercase text-ink leading-[0.82] tracking-tight text-[clamp(2rem,5vw,4.5rem)]">
            {vehicle.make}
          </h2>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h3 className="font-din font-black uppercase text-ink leading-[0.82] tracking-tight text-[clamp(3rem,8vw,6.5rem)]">
              {vehicle.model}
            </h3>
            <div className="flex flex-col gap-2 pt-2">
              <span className="vin-plate text-[11px] bg-paper2">
                {String(vehicle.category).toUpperCase()}
              </span>
              <span className="vin-plate text-[11px]">BUILT FOR THE ROAD</span>
            </div>
          </div>

          {/* script subtitle */}
          <div className="mt-3 flex items-baseline gap-3 flex-wrap">
            <span className="font-script text-3xl text-inkblue leading-none">{d.tagline}</span>
            <div className="h-px flex-1 bg-ink min-w-20" />
            <span className="punch text-mute">reg. plate 0012-NY</span>
          </div>
        </div>
      </header>

      {/* ───────── MAIN BODY — 12 cols ───────── */}
      <div className="grid grid-cols-12 gap-5 px-6 py-5">

        {/* LEFT — side rail of metadata */}
        <aside className="col-span-12 lg:col-span-2 space-y-4">
          <SideBlock label="GENUINE AUTO ENGINEERING">
            <StarBar className="w-16" />
            <div className="punch mt-1 text-mute">EST. 1973</div>
          </SideBlock>

          <SideBlock label="VEHICLE ID">
            <div className="font-mono text-[11px] text-ink">{d.stock}</div>
          </SideBlock>

          <SideBlock label="COLLECTOR EDITION">
            <div className="font-din font-black text-3xl text-ink leading-none">
              {String(vehicle.id).padStart(3,'0')} <span className="text-mute text-base">/ 500</span>
            </div>
          </SideBlock>

          <SideBlock label="EXTERIOR COLOR">
            <div className="font-mono text-[11px] text-ink">{d.color}</div>
            <div className="h-3 mt-1 bg-inkblue border border-ink" />
          </SideBlock>

          <SideBlock label="INTERIOR">
            <div className="font-mono text-[11px] text-ink">BLACK VINYL · PLEATED</div>
          </SideBlock>

          <SideBlock label="PRODUCTION PLANT">
            <div className="font-mono text-[11px] text-ink leading-tight">{d.builtIn}</div>
          </SideBlock>

          <SideBlock label="VIN / CHASSIS">
            <div className="font-mono text-[10px] text-ink leading-tight break-all">{d.vin}</div>
          </SideBlock>

          <SideBlock label="BODY STYLE">
            <div className="font-din font-bold text-sm text-ink uppercase leading-tight">
              {String(vehicle.category)} · 2-door
            </div>
          </SideBlock>

          <SideBlock label="SCAN FOR BUILD SHEET">
            <QrPlate className="mt-1 text-ink" label="" />
          </SideBlock>
        </aside>

        {/* CENTER — spec table + the hero elevation + 3-view */}
        <div className="col-span-12 lg:col-span-7 space-y-4">

          {/* Technical specifications */}
          <div className="frame-box">
            <span className="frame-box-title">TECHNICAL SPECIFICATIONS</span>
            <div className="grid grid-cols-2 gap-x-5 pt-1">
              <table className="spec-table">
                <tbody>
                  <tr><th>Engine</th>        <td>{d.engine}</td></tr>
                  <tr><th>Bore × Stroke</th> <td>{d.bore} × {d.stroke}</td></tr>
                  <tr><th>Displacement</th>  <td>{d.disp} cc</td></tr>
                  <tr><th>Compression</th>   <td>{d.compression} : 1</td></tr>
                  <tr><th>Max power</th>     <td>{d.hp} hp @ 5600 rpm</td></tr>
                  <tr><th>Max torque</th>    <td>{d.torque} lb-ft</td></tr>
                  <tr><th>Firing order</th>  <td>{d.firingOrder}</td></tr>
                </tbody>
              </table>
              <table className="spec-table">
                <tbody>
                  <tr><th>Transmission</th>  <td>{d.trans}</td></tr>
                  <tr><th>Drivetrain</th>    <td>{d.drive}</td></tr>
                  <tr><th>Wheelbase</th>     <td>{d.wheelbase} in</td></tr>
                  <tr><th>Overall length</th><td>{d.length} in</td></tr>
                  <tr><th>Overall width</th> <td>{d.width} in</td></tr>
                  <tr><th>Height</th>        <td>{d.height} in</td></tr>
                  <tr><th>Curb weight</th>   <td>{d.weight} lb</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* HERO side elevation */}
          <div className="relative border-2 border-ink bg-paper px-4 pt-4 pb-2">
            <div className="punch text-mute mb-1">FIG. 1 — SIDE ELEVATION · SCALE 1:14</div>
            <CarSideHero className="w-full h-auto text-ink" />
          </div>

          {/* 3-view: front · side-small · rear */}
          <div className="grid grid-cols-3 gap-3">
            <ThreeView title="FRONT VIEW"><CarFront className="w-full h-auto text-ink" /></ThreeView>
            <ThreeView title="SIDE VIEW"><CarSideHero className="w-full h-auto text-ink" /></ThreeView>
            <ThreeView title="REAR VIEW"><CarRear className="w-full h-auto text-ink" /></ThreeView>
          </div>
        </div>

        {/* RIGHT — asking + perf tiles */}
        <aside className="col-span-12 lg:col-span-3 space-y-3">

          {/* Asking price block — the single bold moment */}
          <div className="border-[3px] border-signal p-3 relative">
            <div className="punch text-mute">ASKING · USD</div>
            <div className="font-din font-black text-ink leading-none text-[clamp(2.4rem,4vw,3.4rem)] tabular-nums mt-1">
              ${vehicle.price.toLocaleString()}
            </div>
            {outOfStock && (
              <span className="absolute -top-3 -right-3 animate-stamp inline-block font-din italic font-black text-paper bg-signal px-2 py-0.5 text-sm uppercase tracking-wide"
                    style={{ transform: 'rotate(-6deg)' }}>
                Sold out
              </span>
            )}
          </div>

          <PerfTile label="PERFORMANCE CLASS" value={d.perfClass} big />
          <PerfTile label="HORSEPOWER"       value={d.hp}   unit="HP" />
          <PerfTile label="TORQUE"           value={d.torque} unit="LB-FT" />
          <PerfTile label="UNITS ON FLOOR"   value={String(vehicle.quantity).padStart(2,'0')}
                    unit={outOfStock ? 'SOLD OUT' : 'IN STOCK'} tone={outOfStock ? 'signal':'ink'} />

          {/* Warning block */}
          <div className="border-2 border-ink p-2 flex items-start gap-2 bg-paper2">
            <div className="w-6 h-6 border-2 border-ink flex items-center justify-center shrink-0">
              <span className="font-din font-black text-ink text-sm leading-none">!</span>
            </div>
            <div className="text-[10px] font-mono leading-tight text-ink uppercase">
              <div className="font-bold">Warning</div>
              <div className="text-mute normal-case tracking-normal">High-performance vehicle · drive responsibly</div>
            </div>
          </div>
        </aside>
      </div>

      {/* ───────── Bottom panel: 4 frame-boxes ─────────  */}
      <div className="px-6 pb-5">
        <div className="grid grid-cols-12 gap-3">

          <div className="col-span-12 md:col-span-3 frame-box">
            <span className="frame-box-title">PERFORMANCE DATA</span>
            <table className="spec-table">
              <tbody>
                <tr><th>0 – 60 mph</th><td>{d.accel060} sec</td></tr>
                <tr><th>¼ mile</th><td>{d.quarter} sec</td></tr>
                <tr><th>Top speed</th><td>{140 + (vehicle.id%4)*10} mph</td></tr>
                <tr><th>Odometer</th><td>{d.mileage} mi</td></tr>
              </tbody>
            </table>
          </div>

          <div className="col-span-12 md:col-span-3 frame-box">
            <span className="frame-box-title">FACTORY OPTIONS</span>
            <ul className="text-[11px] font-mono text-ink leading-6 pt-1">
              <OptLine on label="Air conditioning" />
              <OptLine on label="Power steering" />
              <OptLine on label="Power disc brakes" />
              <OptLine label="Tilt steering column" />
              <OptLine on label="AM/FM radio" />
            </ul>
          </div>

          <div className="col-span-12 md:col-span-3 frame-box">
            <span className="frame-box-title">ENGINE &amp; DRIVETRAIN</span>
            <EngineBlock className="w-full h-auto text-ink mt-1" />
          </div>

          <div className="col-span-12 md:col-span-3 frame-box">
            <span className="frame-box-title">TIRE &amp; WHEEL</span>
            <div className="flex items-center justify-around gap-2 pt-1">
              <WheelDiagram className="w-20 h-20 text-ink" />
              <div className="text-[10px] font-mono text-ink leading-tight">
                <div>AMERICAN RACING</div>
                <div>VN605 · 17&quot;</div>
                <div className="text-mute">P245 / 45 R17</div>
              </div>
            </div>
          </div>

          {/* Chassis spans full width */}
          <div className="col-span-12 frame-box">
            <span className="frame-box-title">CHASSIS DIAGRAM — LADDER FRAME</span>
            <ChassisDiagram className="w-full h-24 text-ink mt-1" />
          </div>
        </div>
      </div>

      {/* ───────── Icon strip — stamped feature callouts ───────── */}
      <div className="px-6 pb-5">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 border-y-2 border-ink py-3">
          <IconFeat Icon={IconDriveFR}      caption={d.drive} />
          <IconFeat Icon={IconTransmission} caption={d.trans} />
          <IconFeat Icon={IconManual}       caption="SHIFT-BY-ROD" />
          <IconFeat Icon={IconBrake}        caption="4-WHEEL DISC" />
          <IconFeat Icon={IconWheel}        caption='17" ALLOY' />
          <IconFeat Icon={IconFlag}         caption="BUILT IN-HOUSE" />
        </div>
      </div>

      {/* ───────── Footer: signature block + barcode + stamp ───────── */}
      <footer className="px-6 pb-5">
        <div className="grid grid-cols-12 gap-4 items-end">
          <SigBlock label="REGISTERED BY" who="M. Baldwin"      sub="SR. REGISTRAR" />
          <SigBlock label="DESIGN ARCHIVE" who={docCode}        sub="BALDWIN&CO ARCHIVE" />
          <SigBlock label="APPROVED BY"    who="C. Engineering" sub="CHIEF ENGINEER" />
          <SigBlock label="DATE"           who={new Date().toISOString().slice(0,10)}
                                           sub={`DOC NO. ${docCode}`} />
        </div>

        <div className="mt-4 border-t-2 border-ink pt-3 flex items-end justify-between gap-5 flex-wrap">
          <div className="flex items-end gap-4 text-ink">
            <Barcode code={d.stock} />
            <div className="text-ink text-right">
              <div className="font-din font-black text-2xl uppercase leading-none">BUILT TO LAST</div>
              <div className="punch text-mute mt-1">★★★★★ · HERITAGE CERTIFIED</div>
            </div>
          </div>

          {/* Actions sit on the right so admins can act without leaving the poster */}
          <div className="flex flex-wrap gap-2">
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
        </div>
      </footer>

      <div className="chevron-band h-3" />
    </article>
  );
}

/* ─────────── small sub-pieces ─────────── */

function IconFeat({ Icon, caption }) {
  return (
    <div className="icon-tile">
      <Icon className="w-8 h-7 text-ink" />
      <span className="punch text-ink">{caption}</span>
    </div>
  );
}

function SideBlock({ label, children }) {
  return (
    <div>
      <div className="punch text-mute border-b border-dotted pb-0.5" style={{borderColor:'var(--rule)'}}>
        {label}
      </div>
      <div className="pt-1">{children}</div>
    </div>
  );
}

function ThreeView({ title, children }) {
  return (
    <div className="border border-ink bg-paper px-2 pt-1 pb-1">
      <div className="punch text-mute text-center">{title}</div>
      {children}
    </div>
  );
}

function PerfTile({ label, value, unit, big, tone = 'ink' }) {
  return (
    <div className="border-2 border-ink p-2 flex items-end justify-between gap-2">
      <div className="punch text-mute">{label}</div>
      <div className="text-right">
        <div className={`font-din font-black leading-none ${big ? 'text-4xl' : 'text-2xl'} ${tone === 'signal' ? 'text-signal' : 'text-ink'}`}>
          {value}
        </div>
        {unit && <div className="punch text-mute mt-0.5">{unit}</div>}
      </div>
    </div>
  );
}

function OptLine({ on, label }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full border border-ink ${on ? 'bg-ink' : ''}`} />
      <span className={on ? 'text-ink' : 'text-mute'}>{label}</span>
    </li>
  );
}

function SigBlock({ label, who, sub }) {
  return (
    <div className="col-span-12 md:col-span-3">
      <div className="punch text-mute">{label}</div>
      <div className="font-script text-2xl text-inkblue leading-none mt-1">{who}</div>
      <div className="border-t border-ink mt-1 pt-1 punch text-mute">{sub}</div>
    </div>
  );
}
