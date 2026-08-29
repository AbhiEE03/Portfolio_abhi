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

export default function Skills() {
  return (
    <section id="skills" className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">Skills</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 md:text-4xl">Technologies & tools</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10">
          {skills.map(({ name, icon: Icon }) => (
            <div key={name} className="flex flex-col items-center gap-2 transition hover:scale-110">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-3xl text-gray-700">
                <Icon />
              </div>
              <p className="text-center text-xs font-medium text-gray-700">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
