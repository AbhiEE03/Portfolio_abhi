import {
  FiCode,
  FiCpu,
  FiDatabase,
  FiGitBranch,
  FiGlobe,
  FiLayers,
} from 'react-icons/fi';
import {
  SiC,
  SiCplusplus,
  SiDocker,
  SiExpress,
  SiGit,
  SiGithub,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiMongodb,
  SiNodedotjs,
  SiNumpy,
  SiOpencv,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRender,
  SiScikitlearn,
  SiTailwindcss,
  SiVercel,
  SiCloudinary,
  SiGo,
} from 'react-icons/si';

const skillGroups = [
  {
    title: 'Languages',
    skills: [
      { name: 'C', icon: SiC },
      { name: 'C++', icon: SiCplusplus },
      { name: 'Python', icon: SiPython },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'Go', icon: SiGo },
      { name: 'MATLAB', icon: FiCpu },
    ],
  },
  {
    title: 'Frontend',
    skills: [
      { name: 'React', icon: SiReact },
      { name: 'HTML5', icon: SiHtml5 },
      { name: 'CSS3', icon: FiLayers },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'Bootstrap', icon: FiGlobe },
      { name: 'Vite', icon: FiCode },
    ],
  },
  {
    title: 'Backend & Databases',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express.js', icon: SiExpress },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'GraphQL', icon: SiGraphql },
      { name: 'JWT', icon: SiJsonwebtokens },
    ],
  },
  {
    title: 'ML & Data / CV',
    skills: [
      { name: 'NumPy', icon: SiNumpy },
      { name: 'Pandas', icon: SiPandas },
      { name: 'Scikit-learn', icon: SiScikitlearn },
      { name: 'OpenCV', icon: SiOpencv },
      { name: 'MediaPipe', icon: FiCpu },
    ],
  },
  {
    title: 'Tools & Platforms',
    skills: [
      { name: 'Git', icon: SiGit },
      { name: 'GitHub', icon: SiGithub },
      { name: 'Docker', icon: SiDocker },
      { name: 'Cloudinary', icon: SiCloudinary },
      { name: 'Vercel', icon: SiVercel },
      { name: 'Render', icon: SiRender },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-12 md:py-20">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Skills</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">What I work with</h2>
      </div>

      <div className="space-y-8">
        {skillGroups.map((group) => (
          <div key={group.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 p-2 text-cyan-200">
                {group.title === 'Languages' ? <FiCode /> : group.title === 'Frontend' ? <FiGlobe /> : group.title === 'Backend & Databases' ? <FiDatabase /> : <FiGitBranch />}
              </span>
              <h3 className="text-xl font-semibold text-white">{group.title}</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {group.skills.map((skill) => {
                const Icon = skill.icon;

                return (
                  <div
                    key={skill.name}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-slate-100"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-lg text-cyan-300">
                      <Icon />
                    </span>
                    <span className="font-medium">{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
