export default function Toast({ message, type = 'success' }) {
  if (!message) return null;
  const colors = type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700';
  return <div className={`fixed right-5 top-5 z-50 rounded-md border px-4 py-3 text-sm shadow-sm ${colors}`}>{message}</div>;
}
