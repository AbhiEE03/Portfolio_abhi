import { FiArrowUpRight, FiExternalLink } from 'react-icons/fi';

const profiles = [
  {
    name: 'Codeforces',
    stat: 'Rating: 1250 (Pupil)',
    href: 'https://codeforces.com/profile/abhisheknoni78',
    accent: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    name: 'LeetCode',
    stat: '1509 contest rating · 200+ problems solved',
    href: 'https://leetcode.com/u/abhiee03/',
    accent: 'from-amber-500/20 to-orange-500/20',
  },
  {
    name: 'GeeksforGeeks',
    stat: 'Profile + Leaderboard',
    href: 'https://www.geeksforgeeks.org/profile/abhishekhtxm',
    accent: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    name: 'GitHub',
    stat: 'Contribution graph',
    href: 'https://github.com/AbhiEE03',
    accent: 'from-violet-500/20 to-fuchsia-500/20',
  },
];

const achievements = [
  'Ideathon – TechNox 2026: 1st Prize',
  'USACO Guide: 70+ problems solved',
  'BIS Hackathon: 2nd Position',
];

export default function CodingProfiles() {
  return (
    <section id="coding-profiles" className="py-12 md:py-20">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Coding Profiles</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">Competitive programming & GitHub</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {profiles.map((profile) => (
          <a
            key={profile.name}
            href={profile.href}
            target="_blank"
            rel="noreferrer"
            className={`group rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${profile.accent} p-[1px] shadow-lg transition hover:-translate-y-1`}
          >
            <div className="h-full rounded-[1.7rem] border border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
                <FiArrowUpRight className="text-lg text-cyan-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              {profile.name === 'GitHub' ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                  <img
                    src="https://ghchart.rshah.org/AbhiEE03"
                    alt="GitHub contribution chart"
                    className="h-20 w-full object-cover"
                  />
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
                  {profile.stat}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-sm text-cyan-300">
                <span>Visit profile</span>
                <FiExternalLink />
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {achievements.map((achievement) => (
          <span
            key={achievement}
            className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-100"
          >
            {achievement}
          </span>
        ))}
      </div>
    </section>
  );
}
