import { useState } from 'react';
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiSend, FiTwitter } from 'react-icons/fi';
import api from '../api/axios';

const initialState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function Contact() {
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/api/contact', formData);
      setStatus({ type: 'success', message: 'Message sent successfully. I will get back to you soon.' });
      setFormData(initialState);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Something went wrong while sending the message.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-12 md:py-20">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Contact</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">Let’s build something</h2>
      </div>

      <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:grid-cols-[0.9fr_1.1fr] md:p-8">
        <aside className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-6">
          <h3 className="text-2xl font-semibold text-white">Get in touch</h3>

          <div className="mt-6 space-y-5 text-slate-300">
            <div className="flex items-start gap-3">
              <span className="mt-1 rounded-full bg-cyan-500/10 p-2 text-cyan-300"><FiMapPin /></span>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Location</p>
                <p className="mt-1 text-white">Patna, Bihar, India</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 rounded-full bg-cyan-500/10 p-2 text-cyan-300"><FiMail /></span>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Email</p>
                <a href="mailto:abhisheknoni78@gmail.com" className="mt-1 text-white hover:text-cyan-200">
                  abhisheknoni78@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 text-xl text-slate-200">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/5 p-3 hover:text-cyan-300">
              <FiTwitter />
            </a>
            <a href="https://github.com/AbhiEE03" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/5 p-3 hover:text-cyan-300">
              <FiGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/5 p-3 hover:text-cyan-300">
              <FiLinkedin />
            </a>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60"
              />
            </label>
          </div>

          <label className="block space-y-2 text-sm text-slate-300">
            <span>Subject</span>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60"
            />
          </label>

          <label className="block space-y-2 text-sm text-slate-300">
            <span>Message</span>
            <textarea
              name="message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60"
            />
          </label>

          {status.message && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                status.type === 'success'
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                  : 'border-red-500/40 bg-red-500/10 text-red-200'
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-medium text-slate-950 shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Sending...' : 'Send Message'}
            <FiSend />
          </button>
        </form>
      </div>
    </section>
  );
}
