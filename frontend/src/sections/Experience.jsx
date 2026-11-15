import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

import bnpCertificate from '../assets/bnp/certificate.jpg';
import bnpTeamStage from '../assets/bnp/team-stage.jpg';
import bnpTeamGroup from '../assets/bnp/team-group.jpg';

const experience = [
  {
    title: 'Hackathon Participant — Innoversité 2026',
    subtitle: 'BNP Paribas, Mumbai',
    date: 'Oct 2026',
    description:
      'Built Reg IRIS with a team of six in 24 hours: a searchable, versioned repository of regulatory documents and a JSON rule engine that flags which trades breach which rule, and why.',
    photos: [
      { src: bnpCertificate, alt: 'Receiving the certificate of participation at the BNP Paribas Innoversité Hackathon 2026' },
      { src: bnpTeamStage, alt: 'Team photo on stage at the BNP Paribas Innoversité Hackathon 2026' },
      { src: bnpTeamGroup, alt: 'Team with a mentor at the BNP Paribas Innoversité Hackathon 2026' },
    ],
  },
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

function DateLabel({ date, align }) {
  return (
    <div
      className={`hidden items-start pt-4 md:flex ${
        align === 'left' ? 'justify-start md:pl-6' : 'justify-end md:pr-6'
      }`}
    >
      <span className="text-sm font-bold uppercase tracking-[0.15em] text-red-500">{date}</span>
    </div>
  );
}

function TimelineCard({ item, isLeft, onOpenPhoto }) {
  return (
    <motion.div
      className={isLeft ? 'md:pr-6' : 'md:pl-6'}
      custom={isLeft}
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

        {item.photos?.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {item.photos.map((photo) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => onOpenPhoto(photo)}
                className="overflow-hidden rounded-lg ring-1 ring-gray-200 transition hover:ring-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label={`Enlarge photo: ${photo.alt}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition duration-300 hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function PhotoLightbox({ photo, onClose }) {
  useEffect(() => {
    if (!photo) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-200 transition hover:text-red-300"
        aria-label="Close photo"
      >
        <FiX />
      </button>
      <img
        src={photo.src}
        alt={photo.alt}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
      />
    </div>
  );
}

export default function Experience() {
  const [openPhoto, setOpenPhoto] = useState(null);

  return (
    <section id="experience" className="overflow-x-hidden bg-white py-12 md:py-20">
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
                      <TimelineCard item={item} isLeft onOpenPhoto={setOpenPhoto} />
                      <DateLabel date={item.date} align="left" />
                    </>
                  ) : (
                    <>
                      <DateLabel date={item.date} align="right" />
                      <TimelineCard item={item} isLeft={false} onOpenPhoto={setOpenPhoto} />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PhotoLightbox photo={openPhoto} onClose={() => setOpenPhoto(null)} />
    </section>
  );
}
