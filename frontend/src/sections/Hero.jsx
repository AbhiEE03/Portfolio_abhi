import { FiArrowRight, FiBriefcase } from 'react-icons/fi';

export default function Hero() {
  return (
    <section id="home" className="grid items-center gap-8 py-12 md:grid-cols-[1.2fr_0.8fr] md:py-20">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-200">
          <FiBriefcase className="text-base" />
          Available for opportunities
        </span>

        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
          Abhishek Kumar
        </h1>

        <div className="mt-4 inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-base font-medium text-violet-200">
          Web Developer, UI/UX Designer, Competitive Programmer
        </div>

        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
          I build thoughtful digital experiences with a strong focus on clean UI, scalable web systems,
          and problem-solving through code.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="mailto:abhisheknoni78@gmail.com"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-medium text-slate-950 shadow-glow transition hover:scale-[1.02]"
          >
            Hire Me
            <FiArrowRight />
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-slate-100 transition hover:border-cyan-400/50 hover:text-cyan-200"
          >
            Contact Me
          </a>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/10 px-6 py-3 font-medium text-violet-200 transition hover:bg-violet-500/20"
          >
            My Resume
          </a>
        </div>
      </div>

      <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute -left-4 top-10 h-24 w-24 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -right-4 bottom-8 h-28 w-28 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative space-y-5">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Experience</p>
            <p className="mt-3 text-3xl font-bold text-white">2+ Years</p>
            <p className="mt-2 text-slate-300">Building products, interfaces, and CS problem-solving skills.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
              <p className="text-sm text-cyan-200">Projects</p>
              <p className="mt-2 text-2xl font-bold text-white">15+</p>
            </div>
            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
              <p className="text-sm text-violet-200">Contests</p>
              <p className="mt-2 text-2xl font-bold text-white">100+</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Currently focused on</p>
            <p className="mt-2 text-lg font-semibold text-white">Full-stack development • UX • DSA</p>
          </div>
        </div>
      </div>
    </section>
  );
}
