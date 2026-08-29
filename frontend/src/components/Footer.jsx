import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-300 md:flex-row md:px-6">
        <p>© {new Date().getFullYear()} Abhishek Kumar. All rights reserved.</p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/AbhiEE03"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-cyan-300 transition hover:text-cyan-200"
          >
            Designed By Abhishek Kumar
          </a>

          {/* Low-visibility admin link — accessible but not prominent */}
          <Link
            to="/admin/login"
            className="text-xs text-slate-600 transition hover:text-slate-400"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
