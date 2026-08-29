import { useEffect } from 'react';
import { FiExternalLink, FiGithub, FiX } from 'react-icons/fi';

export default function ProjectModal({ project, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-200 transition hover:text-cyan-300"
          aria-label="Close project details"
        >
          <FiX />
        </button>

        <div className="max-h-[90vh] overflow-y-auto">
          <img
            src={project.imageUrl || 'https://placehold.co/1200x800/0f172a/94a3b8?text=Project+Preview'}
            alt={project.title}
            className="h-64 w-full object-cover"
          />

          <div className="space-y-6 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">{project.category}</p>
                <h3 className="mt-2 text-2xl font-bold text-white">{project.title}</h3>
              </div>

              {project.featured && (
                <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-violet-200">
                  Featured
                </span>
              )}
            </div>

            <p className="text-slate-300">{project.description}</p>

            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2.5 font-medium text-slate-950 transition hover:bg-cyan-400"
                >
                  Live Demo
                  <FiExternalLink />
                </a>
              )}

              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 font-medium text-slate-100 transition hover:border-violet-400/40 hover:text-violet-200"
                >
                  GitHub
                  <FiGithub />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
