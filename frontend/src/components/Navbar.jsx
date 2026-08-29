import { Link } from 'react-router-dom';
import favicon from '/favicon.png';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: 'Admin', to: '/admin/login' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-sm text-slate-200 md:px-6">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold tracking-wide text-white">
          <img src={favicon} alt="Abhishek Kumar logo" className="h-8 w-8 rounded-full object-cover" />
          <span>Abhishek Kumar</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="transition hover:text-cyan-300">
              {link.label}
            </Link>
          ))}
        </div>

        <a
          href="/resume.pdf"
          className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 font-medium text-cyan-200 transition hover:bg-cyan-500/20"
        >
          My Resume
        </a>
      </nav>
    </header>
  );
}
