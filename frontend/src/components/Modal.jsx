export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4" onClick={onClose}>
      <div
        className="plate w-full max-w-2xl"
        style={{boxShadow:'3px 3px 0 0 var(--ink)'}}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-end justify-between border-b-2 border-ink px-5 py-3">
          <div>
            <div className="punch text-mute">form · 7B — intake / amendment</div>
            <h3 className="font-din font-black text-ink text-3xl uppercase leading-none mt-0.5">{title}</h3>
          </div>
          <button
            className="punch text-ink hover:text-signal transition"
            onClick={onClose}
            aria-label="Close"
          >
            [ close ]
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
