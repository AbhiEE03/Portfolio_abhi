const experience = [
  {
    title: 'Student Placement Coordinator',
    subtitle: 'TnP Cell, NIT Mizoram',
    date: 'May 2026 – Present',
    description: 'Facilitating campus recruitment drives and acting as the primary point of contact for visiting companies.',
  },
  {
    title: 'Backend Engineering Intern',
    subtitle: '7Hills Nexgram / 7HNG, Chennai (Hybrid)',
    date: 'June 2026 – Present',
    description: 'Built a tenant lifecycle system in Go and PostgreSQL with API key management and GraphQL API design.',
  },
  {
    title: 'Web Development Intern',
    subtitle: 'SkillCraft Technology, Mumbai',
    date: 'Dec 2025 – Jan 2026',
    description: 'Delivered 4 production-ready projects across user-facing and backend-focused problem statements.',
  },
  {
    title: 'Campus Ambassador',
    subtitle: 'NxtWave',
    date: 'Aug 2025 – Present',
    description: 'Organised an OpenAI × NxtWave hackathon and an institute-wide DSA contest to encourage participation.',
  },
  {
    title: 'Assistant Student Activity Coordinator',
    subtitle: 'TnP Cell, NIT Mizoram',
    date: 'May 2025 – May 2026',
    description: 'Coordinated Viksit Bharat@2047, Orientation Program, Convocation, and the Fresher’s Party.',
  },
  {
    title: 'Executive Member',
    subtitle: 'Think India, NIT Mizoram',
    date: 'Dec 2024 – Present',
    description: 'Represented the institution at major national-level academic and policy events and summits.',
  },
  {
    title: 'Contributor @ GSSOC',
    subtitle: 'GirlScript Summer of Code',
    date: 'July – Dec 2025',
    description: 'Contributed to open-source initiatives and collaborated with developers across the community.',
  },
  {
    title: 'B.Tech — EE Major / AIML Minor',
    subtitle: 'NIT Mizoram',
    date: '2023 – 2027 | CGPA 8.44',
    description: 'Focused on electrical engineering fundamentals with a growing interest in AI and intelligent systems.',
  },
  {
    title: 'Higher Secondary',
    subtitle: 'Vivekanand Public School, Warisaliganj, Bihar',
    date: '2022 | CBSE | 86.4%',
    description: 'Completed senior secondary education with a strong foundation in mathematics and science.',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-12 md:py-20">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Experience & Education</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">Timeline</h2>
      </div>

      <div className="relative ml-2 border-l border-white/15 pl-6 md:ml-4 md:pl-8">
        {experience.map((item) => (
          <div key={`${item.title}-${item.date}`} className="relative pb-8 last:pb-0">
            <span className="absolute -left-[2.1rem] top-1.5 h-4 w-4 rounded-full border-4 border-slate-950 bg-cyan-400 shadow-glow" />
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-slate-300">{item.subtitle}</p>
                </div>
                <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-cyan-200">
                  {item.date}
                </span>
              </div>
              <p className="mt-4 text-slate-300">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
