import { useEffect, useMemo, useState } from 'react';
import { FiPlus, FiExternalLink, FiGithub } from 'react-icons/fi';
import api from '../api/axios';
import ProjectModal from './ProjectModal';

import brokeryImg from '../assets/brokery.png';
import trustFlowImg from '../assets/trustflowKYC.png';
import sahayaImg from '../assets/sahaya.png';
import eatitImg from '../assets/eatit.png';
import calendarImg from '../assets/calendar.png';

import bgChangerImg from '../assets/background_changer.png';
import currencyImg from '../assets/currency_converter.png';

const filters = ['All', 'Web Development', 'Machine Learning', 'UI/UX Designing'];

const projectImageMap = {
  Brokery: brokeryImg,
  'TrustFlow KYC': trustFlowImg,
  Sahaya: sahayaImg,
  'Meal Delivery Website': eatitImg,
  'TUF Calendar': calendarImg,

  'Background Changer': bgChangerImg,
  'Currency Converter': currencyImg,
};

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
    <section id="projects" className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">Projects</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 md:text-4xl">Selected work</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeFilter === filter
                    ? 'border-red-400/50 bg-red-500/15 text-red-600'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900'
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
              <div key={index} className="animate-pulse rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="h-48 rounded-lg bg-gray-200" />
                <div className="mt-4 h-5 w-2/3 rounded bg-gray-300" />
                <div className="mt-3 h-4 w-full rounded bg-gray-300" />
                <div className="mt-2 h-4 w-5/6 rounded bg-gray-300" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <article
                key={project._id}
                className={`group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card transition hover:shadow-md ${
                  project.featured ? 'ring-2 ring-red-500' : ''
                }`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.imageUrl || projectImageMap[project.title]}
                    alt={project.title}
                    className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {project.featured && (
                    <span className="absolute left-4 top-4 rounded-full border border-red-400/30 bg-red-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                      Featured
                    </span>
                  )}
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="rounded-full border border-gray-300 bg-white p-2 text-lg text-gray-600 transition hover:border-red-400 hover:text-red-500"
                      aria-label={`View ${project.title}`}
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <p className="line-clamp-3 text-sm leading-6 text-gray-600">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.slice(0, 4).map((tech) => (
                      <span
                        key={`${project._id}-${tech}`}
                        className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] text-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-red-500 transition hover:text-red-600"
                      >
                        <FiExternalLink />
                        Visit Live Site
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
                      >
                        <FiGithub />
                        View Code
                      </a>
                    )}
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
      </div>
    </section>
  );
}
