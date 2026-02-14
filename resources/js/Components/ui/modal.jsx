export function Modal({ open, onClose, title, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-8 z-10 animate-in fade-in zoom-in-95 duration-150">
        <h2 className="text-lg font-semibold mb-6">{title}</h2>
        {children}
      </div>
    </div>
  )
}
