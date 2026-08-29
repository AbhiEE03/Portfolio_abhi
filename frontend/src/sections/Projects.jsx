import { useEffect, useMemo, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import api from '../api/axios';
import ProjectModal from './ProjectModal';

const filters = ['All', 'Web Development', 'Machine Learning', 'UI/UX Designing'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/api/projects');
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const sorted = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));

    if (activeFilter === 'All') return sorted;
    return sorted.filter((project) => project.category === activeFilter);
  }, [activeFilter, projects]);

  return (
    <section id="projects" className="py-12 md:py-20">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Projects</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">Selected work</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                activeFilter === filter
                  ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-100'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/15 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
              <div className="h-48 rounded-2xl bg-slate-800/80" />
              <div className="mt-4 h-5 w-2/3 rounded bg-slate-700/80" />
              <div className="mt-3 h-4 w-full rounded bg-slate-700/80" />
              <div className="mt-2 h-4 w-5/6 rounded bg-slate-700/80" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <article
              key={project._id}
              className={`group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-xl ${
                project.featured ? 'ring-1 ring-violet-500/30' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={project.imageUrl || 'https://placehold.co/1200x800/0f172a/94a3b8?text=Project+Preview'}
                  alt={project.title}
                  className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                />
                {project.featured && (
                  <span className="absolute left-4 top-4 rounded-full border border-violet-400/30 bg-violet-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-100">
                    Featured
                  </span>
                )}
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="rounded-full border border-white/10 bg-slate-900/80 p-2 text-lg text-cyan-300 transition hover:border-cyan-400/40 hover:text-cyan-200"
                    aria-label={`View ${project.title}`}
                  >
                    <FiPlus />
                  </button>
                </div>

                <p className="line-clamp-3 text-sm leading-6 text-slate-300">{project.description}</p>

                <div className="flex flex-wrap gap-2">
                  {project.techStack?.slice(0, 4).map((tech) => (
                    <span
                      key={`${project._id}-${tech}`}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ProjectModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
