import { motion } from 'framer-motion';

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
    description: "Coordinated Viksit Bharat@2047, Orientation Program, Convocation, and the Fresher's Party.",
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

const cardVariants = {
  hidden: (isLeft) => ({ x: isLeft ? -100 : 100, opacity: 0 }),
  visible: { x: 0, opacity: 1, transition: { duration: 0.55, ease: 'easeOut' } },
};

export default function Experience() {
  return (
    <section id="experience" className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center md:mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            Experience &amp; Education
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 md:text-5xl">
            Timeline
          </h2>
        </div>

        <div className="relative">
          {/* Central vertical line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-red-400 via-red-500 to-red-400 opacity-60 md:block" />

          {experience.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div key={`${item.title}-${item.date}`} className="relative mb-4 md:mb-6">
                {/* Timeline dot */}
                <div className="absolute left-1/2 top-5 z-10 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-red-500 bg-white shadow-[0_0_0_3px_rgba(239,68,68,0.15)] md:block" />

                <div className="grid md:grid-cols-2 md:gap-6">
                  {isLeft ? (
                    <>
                      {/* Card slides in from LEFT */}
                      <motion.div
                        className="md:pr-6"
                        custom={true}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.25 }}
                      >
                        <div className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.07)] ring-1 ring-gray-100 transition hover:shadow-[0_8px_30px_rgba(239,68,68,0.1)] hover:ring-red-200 md:p-5">
                          <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-red-600 md:text-xl">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-red-500">{item.subtitle}</p>
                          {/* Mobile date */}
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 md:hidden">
                            {item.date}
                          </p>
                          <p className="mt-2.5 text-sm leading-relaxed text-gray-600">{item.description}</p>
                        </div>
                      </motion.div>

                      {/* Date label, right column */}
                      <div className="hidden items-start justify-start md:flex md:pl-6 pt-4">
                        <span className="text-sm font-bold uppercase tracking-[0.15em] text-red-500">
                          {item.date}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Date label, left column */}
                      <div className="hidden items-start justify-end md:flex md:pr-6 pt-4">
                        <span className="text-sm font-bold uppercase tracking-[0.15em] text-red-500">
                          {item.date}
                        </span>
                      </div>

                      {/* Card slides in from RIGHT */}
                      <motion.div
                        className="md:pl-6"
                        custom={false}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.25 }}
                      >
                        <div className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.07)] ring-1 ring-gray-100 transition hover:shadow-[0_8px_30px_rgba(239,68,68,0.1)] hover:ring-red-200 md:p-5">
                          <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-red-600 md:text-xl">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-red-500">{item.subtitle}</p>
                          {/* Mobile date */}
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 md:hidden">
                            {item.date}
                          </p>
                          <p className="mt-2.5 text-sm leading-relaxed text-gray-600">{item.description}</p>
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
