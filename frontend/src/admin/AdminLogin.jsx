import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/api/auth/login', form);
      localStorage.setItem('token', data.token);
      const nextLocation = location.state?.from?.pathname || '/admin/dashboard';
      navigate(nextLocation, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Admin</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-white">Login</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block space-y-2 text-sm text-slate-300">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60"
            />
          </label>

          <label className="block space-y-2 text-sm text-slate-300">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60"
            />
          </label>

          {error && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-medium text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}
