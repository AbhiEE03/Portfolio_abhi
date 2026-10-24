import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

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
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route or hash changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  /**
   * For hash links (Home, About, etc.):
   *   - If already on '/', just update the hash so the browser scrolls smoothly.
   *   - If on any other route (/blog, /blog/:slug, …), navigate to '/#section'
   *     which loads the home page; the browser will scroll to the anchor.
   */
  const handleHashClick = (e, href) => {
    e.preventDefault();
    if (isHome) {
      // Smooth-scroll within the current page
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback: just set the hash
        window.location.hash = href;
      }
    } else {
      // Navigate to home with hash — React Router will load '/' and
      // the browser will jump to the anchor once the page renders.
      navigate('/' + href);
    }
  };

  // Shared by the desktop row and the mobile dropdown; onNavigate runs after a click
  const renderLink = (link, extraClassName = '', onNavigate = () => {}) => {
    const isBlog = link.href.startsWith('/');

    const isActive =
      (!isBlog && isHome && (link.href === '#home' || window.location.hash === '') && window.location.hash === link.href) ||
      (!isBlog && isHome && window.location.hash === link.href) ||
      (isBlog && location.pathname.startsWith(link.href));

    const className = `text-sm font-medium transition ${
      isActive ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
    } ${extraClassName}`;

    if (isBlog) {
      return (
        <Link key={link.label} to={link.href} onClick={onNavigate} className={className}>
          {link.label}
        </Link>
      );
    }

    return (
      <a
        key={link.label}
        href={isHome ? link.href : `/${link.href}`}
        onClick={(e) => {
          handleHashClick(e, link.href);
          onNavigate();
        }}
        className={className}
      >
        {link.label}
      </a>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-sm md:px-6">
        {/* Logo — always goes back to home */}
        <a
          href="/#home"
          onClick={(e) => handleHashClick(e, '#home')}
          className="text-3xl font-black tracking-tight text-red-500 hover:text-red-600"
        >
          My Portfolio
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => renderLink(link))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            My Resume
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="rounded-md p-2 text-2xl text-gray-700 transition hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 md:hidden"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-nav" className="border-t border-gray-200 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {navLinks.map((link) => renderLink(link, 'py-3', () => setMenuOpen(false)))}
          </div>
        </div>
      )}
    </header>
  );
}
