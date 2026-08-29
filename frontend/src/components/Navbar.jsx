import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
];

const resumeUrl = 'https://drive.google.com/file/d/1fVFmdhSSj0sN7Cbi9zAwoG1iirCk3wop/view?usp=sharing';

export default function Navbar() {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-sm md:px-6">
        <a href="#home" className="text-3xl font-black tracking-tight text-red-500 hover:text-red-600">
          My Portfolio
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isBlog = link.href.startsWith('/');
            const isActive =
              (!isBlog && (link.href === '#home' || window.location.hash === '') && currentPath === '/') ||
              (!isBlog && window.location.hash === link.href);

            const className = `text-sm font-medium transition ${
              isActive ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
            }`;

            if (isBlog) {
              return (
                <Link key={link.label} to={link.href} className={className}>
                  {link.label}
                </Link>
              );
            }

            return (
              <a key={link.label} href={link.href} className={className}>
                {link.label}
              </a>
            );
          })}
        </div>

        <a
          href={resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          My Resume
        </a>
      </nav>
    </header>
  );
}
