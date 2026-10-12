import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-black text-2xl shadow-xl mb-6">
        FD
      </div>
      <h1 className="text-4xl font-black tracking-tight mb-2">404 — Page Not Found</h1>
      <p className="text-slate-400 max-w-md text-sm mb-6">
        The requested page or bakery storefront could not be located. It may have moved or does not exist on FlowDineOS.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-sm shadow-md transition-all text-white"
        >
          Return to FlowDineOS Home
        </Link>
        <Link
          href="/sweet-delights"
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-sm border border-slate-700 transition-all text-slate-200"
        >
          Explore Sweet Delights
        </Link>
      </div>
    </div>
  );
}
