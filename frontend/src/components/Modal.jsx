export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4"
      onClick={onClose}
    >
      <div className="plate w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-ink px-5 py-3">
          <div>
            <div className="punch text-mute">form&nbsp;7B · section</div>
            <h3 className="font-display font-bold text-ink text-xl leading-none mt-0.5">{title}</h3>
          </div>
          <button
            className="punch text-ink hover:text-rust transition"
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
