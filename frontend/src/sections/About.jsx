import aboutImage from '../assets/about.jpg';
import {
  SiC,
  SiCplusplus,
  SiPython,
  SiJavascript,
  SiGo,
  SiReact,
  SiHtml5,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiGithub,
} from 'react-icons/si';

const skills = [
  { name: 'C', icon: SiC },
  { name: 'C++', icon: SiCplusplus },
  { name: 'Python', icon: SiPython },
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'Go', icon: SiGo },
  { name: 'React', icon: SiReact },
  { name: 'HTML5', icon: SiHtml5 },
  { name: 'Tailwind', icon: SiTailwindcss },
  { name: 'Node.js', icon: SiNodedotjs },
  { name: 'Express', icon: SiExpress },
  { name: 'MongoDB', icon: SiMongodb },
  { name: 'PostgreSQL', icon: SiPostgresql },
  { name: 'Git', icon: SiGit },
  { name: 'GitHub', icon: SiGithub },
];

export default function About() {
  return (
    <section id="about" className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-start gap-10 md:grid-cols-2">
          {/* Left: Photo */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-2 shadow-card">
            <img
              src={aboutImage}
              alt="Abhishek Kumar"
              className="h-72 w-full rounded-md object-cover md:h-96"
            />
          </div>

          {/* Right: Label, heading, paragraph, skill icons */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
              Learn About Me
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 md:text-4xl">
              SKILLS
            </h2>

            <p className="mt-5 text-base leading-7 text-gray-700">
              I'm a MERN stack developer, proficient in DSA, focussed on providing efficient
              solutions to real-world issues
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {skills.map(({ name, icon: Icon }) => (
                <div
                  key={name}
                  className="flex flex-col items-center gap-1 transition hover:scale-110"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-2xl text-gray-700">
                    <Icon />
                  </div>
                  <p className="text-center text-xs font-medium text-gray-700">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
