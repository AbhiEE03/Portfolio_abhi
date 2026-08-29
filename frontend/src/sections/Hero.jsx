import { FiArrowRight, FiBriefcase } from 'react-icons/fi';
import heroImage from '../assets/hero.jpg';

export default function Hero() {
  return (
    <section id="home" className="bg-midnight py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-sm font-medium text-red-100">
              <FiBriefcase className="text-base" />
              Available for opportunities
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
              Abhishek Kumar
            </h1>

            <p className="mt-4 text-lg font-medium text-slate-300">
              Web Developer, UI/UX Designer, Competitive Programmer
            </p>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-400">
              I build thoughtful digital experiences with a strong focus on clean UI, scalable web systems,
              and problem-solving through code.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="mailto:abhisheknoni78@gmail.com"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-white transition hover:opacity-90"
              >
                Hire Me
                <FiArrowRight />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-red-400/50 bg-transparent px-6 py-3 font-medium text-white transition hover:bg-red-500/10"
              >
                Contact Me
              </a>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-400/30 bg-transparent px-6 py-3 font-medium text-slate-300 transition hover:text-white"
              >
                My Resume
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src={heroImage}
              alt="Abhishek Kumar"
              className="h-80 w-64 rounded-lg border-2 border-slate-400/20 object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
