import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-cyan-300">404</p>
        <h1 className="mb-4 text-4xl font-bold text-white">Page not found</h1>
        <p className="mb-8 text-slate-300">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="inline-flex rounded-full bg-cyan-500 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-400"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
