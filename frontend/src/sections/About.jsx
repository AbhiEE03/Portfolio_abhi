export default function About() {
  return (
    <section id="about" className="py-12 md:py-20">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">About</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">Who I am</h2>
      </div>

      <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:grid-cols-[1.3fr_0.7fr] md:p-8">
        <div className="space-y-4 text-slate-300">
          <p>
            I’m a developer with a strong interest in building polished, user-focused web products and
            solving real-world engineering problems. My work blends design thinking, product sense, and
            strong technical execution.
          </p>
          <p>
            I enjoy creating modern interfaces, exploring backend systems, and learning through practical
            projects and competitive programming. I like building things that are both elegant and useful.
          </p>
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-200">
          <div>
            <p className="text-slate-400">Location</p>
            <p className="mt-1 font-medium text-white">Patna, Bihar</p>
          </div>
          <div>
            <p className="text-slate-400">Education</p>
            <p className="mt-1 font-medium text-white">B.Tech in EE with AIML minor</p>
          </div>
          <div>
            <p className="text-slate-400">Current focus</p>
            <p className="mt-1 font-medium text-white">MERN, DSA, product design</p>
          </div>
        </div>
      </div>
    </section>
  );
}
