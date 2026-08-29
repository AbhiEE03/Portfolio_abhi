import { FiArrowRight } from 'react-icons/fi';
import Typewriter from 'typewriter-effect';
import heroImage from '../assets/hero.jpg';

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-slate-950 py-16 md:py-28">
      {/* Richer decorative background: gradient mesh blobs and subtle grid */}
      <div className="absolute inset-0 z-0 opacity-40">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glowing gradient blobs */}
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-red-500/20 mix-blend-screen blur-[100px]" />
        <div className="absolute -right-20 top-40 h-96 w-96 rounded-full bg-cyan-500/10 mix-blend-screen blur-[100px]" />
        <div className="absolute bottom-[-10%] left-1/3 h-96 w-96 rounded-full bg-violet-500/10 mix-blend-screen blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-12 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-lg font-medium text-slate-300">I'm</p>

            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
              Abhishek Kumar
            </h1>

            {/* Typing animation cycling through the three roles */}
            <div className="mt-4 text-xl font-medium text-slate-300">
              <Typewriter
                options={{
                  strings: [
                    'Web Developer',
                    'UI/UX Designer',
                    'Competitive Programmer',
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 60,
                  deleteSpeed: 40,
                }}
              />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              {/* Hire Me — mailto link, matches original */}
              <a
                href="mailto:abhisheknoni78@gmail.com"
                className="inline-flex items-center gap-2 rounded-full bg-red-500 px-7 py-3.5 font-medium text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] transition hover:bg-red-600 hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]"
              >
                Hire Me
                <FiArrowRight />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-red-400/50 bg-transparent px-7 py-3.5 font-medium text-white transition hover:bg-red-500/10"
              >
                Contact Me
              </a>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm">
              {/* Optional backdrop glow behind image */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-red-500/20 to-cyan-500/20 blur-2xl" />
              <img
                src={heroImage}
                alt="Abhishek Kumar"
                className="relative z-10 aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                style={{
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
