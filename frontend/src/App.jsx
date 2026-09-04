import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import Hero from './sections/Hero';
import About from './sections/About';

import CodingProfiles from './sections/CodingProfiles';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import PageMeta from './components/PageMeta';

const sectionMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

function HomePage() {
  // When navigating from /blog → /#about, React Router loads this component
  // but the browser won't auto-scroll to the hash in a SPA. We do it manually.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.replace('#', '');
    let attempts = 0;
    const maxAttempts = 15;

    // Retry until the element exists (framer-motion may delay rendering)
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (attempts < maxAttempts) {
        attempts += 1;
        setTimeout(tryScroll, 100);
      }
    };

    // Small initial delay so sections have time to mount
    setTimeout(tryScroll, 80);
  }, []);

  return (
    <>
      <PageMeta title="Abhishek Kumar | Portfolio" description="Portfolio of Abhishek Kumar, a web developer, designer, and competitive programmer." />
      <motion.div {...sectionMotion}>
        <Hero />
      </motion.div>
      <motion.div {...sectionMotion}>
        <About />
      </motion.div>
      <motion.div {...sectionMotion}>
        <CodingProfiles />
      </motion.div>
      <motion.div {...sectionMotion}>
        <Experience />
      </motion.div>
      <motion.div {...sectionMotion}>
        <Projects />
      </motion.div>
      <motion.div {...sectionMotion}>
        <Contact />
      </motion.div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />

        <main className="w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<><PageMeta title="Blog — Abhishek Kumar" description="Blog posts and technical notes by Abhishek Kumar." /><BlogList /></>} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<><PageMeta title="Page Not Found — Abhishek Kumar" description="The requested page could not be found." /><NotFound /></>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
