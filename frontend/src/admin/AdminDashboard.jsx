import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../api/axios';

const emptyProjectForm = {
  title: '',
  description: '',
  techStack: '',
  category: 'Web Development',
  liveLink: '',
  githubLink: '',
  featured: false,
  order: 0,
  imageFile: null,
};

const emptyBlogForm = {
  title: '',
  content: '',
  coverImageFile: null,
  excerpt: '',
  published: true,
};

const formatList = (items = []) => items.join(', ');

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Projects');
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [blogForm, setBlogForm] = useState(emptyBlogForm);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const authToken = useMemo(() => localStorage.getItem('token'), []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/api/projects');
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  };

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get('/api/blog');
      setBlogs(data);
    } catch (err) {
      console.error('Failed to load blogs', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProjects(), fetchBlogs()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken) {
      navigate('/admin/login', { replace: true });
      return;
    }

    loadData();
  }, [authToken, navigate]);

  const resetProjectForm = () => {
    setProjectForm(emptyProjectForm);
    setEditingProjectId(null);
  };

  const resetBlogForm = () => {
    setBlogForm(emptyBlogForm);
    setEditingBlogId(null);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await api.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.url;
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const payload = {
        ...projectForm,
        techStack: projectForm.techStack
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        order: Number(projectForm.order || 0),
        featured: Boolean(projectForm.featured),
      };

      if (projectForm.imageFile) {
        payload.imageUrl = await uploadImage(projectForm.imageFile);
      }

      const apiCall = editingProjectId
        ? api.put(`/api/projects/${editingProjectId}`, payload)
        : api.post('/api/projects', payload);

      await apiCall;
      resetProjectForm();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Project save failed.');
    }
  };

  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const payload = {
        title: blogForm.title,
        content: blogForm.content,
        excerpt: blogForm.excerpt || blogForm.content.replace(/<[^>]*>/g, ' ').trim().slice(0, 150),
        published: blogForm.published,
      };

      if (blogForm.coverImageFile) {
        payload.coverImageUrl = await uploadImage(blogForm.coverImageFile);
      }

      const apiCall = editingBlogId
        ? api.put(`/api/blog/${editingBlogId}`, payload)
        : api.post('/api/blog', payload);

      await apiCall;
      resetBlogForm();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Blog save failed.');
    }
  };

  const handleProjectDelete = async (id) => {
    try {
      await api.delete(`/api/projects/${id}`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Project delete failed.');
    }
  };

  const handleBlogDelete = async (id) => {
    try {
      await api.delete(`/api/blog/${id}`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Blog delete failed.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login', { replace: true });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Admin</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-white">Dashboard</h1>
        </div>

        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-red-400/40 hover:text-red-200"
        >
          Logout
        </button>
      </div>

      <div className="mb-6 flex gap-3 rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
        {['Projects', 'Blog'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === tab ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">Loading dashboard...</div>
      ) : activeTab === 'Projects' ? (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Project List</h2>
              <button
                type="button"
                onClick={resetProjectForm}
                className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950"
              >
                Add Project
              </button>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project._id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-white">{project.title}</p>
                    <p className="text-sm text-slate-300">{project.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setProjectForm({
                          title: project.title,
                          description: project.description,
                          techStack: formatList(project.techStack || []),
                          category: project.category,
                          liveLink: project.liveLink || '',
                          githubLink: project.githubLink || '',
                          featured: Boolean(project.featured),
                          order: project.order || 0,
                          imageFile: null,
                        });
                        setEditingProjectId(project._id);
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleProjectDelete(project._id)}
                      className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <h2 className="mb-4 text-xl font-semibold text-white">
              {editingProjectId ? 'Edit Project' : 'Add Project'}
            </h2>

            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <input
                value={projectForm.title}
                onChange={(event) => setProjectForm((previous) => ({ ...previous, title: event.target.value }))}
                placeholder="Title"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"
                required
              />

              <textarea
                value={projectForm.description}
                onChange={(event) => setProjectForm((previous) => ({ ...previous, description: event.target.value }))}
                placeholder="Description"
                rows="4"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"
                required
              />

              <input
                value={projectForm.techStack}
                onChange={(event) => setProjectForm((previous) => ({ ...previous, techStack: event.target.value }))}
                placeholder="Tech stack, comma separated"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"
              />

              <select
                value={projectForm.category}
                onChange={(event) => setProjectForm((previous) => ({ ...previous, category: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"
              >
                <option>Web Development</option>
                <option>Machine Learning</option>
                <option>UI/UX Designing</option>
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(event) => setProjectForm((previous) => ({ ...previous, imageFile: event.target.files?.[0] || null }))}
                className="w-full rounded-2xl border border-dashed border-white/10 bg-slate-950/80 px-4 py-3 text-white"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={projectForm.liveLink}
                  onChange={(event) => setProjectForm((previous) => ({ ...previous, liveLink: event.target.value }))}
                  placeholder="Live link"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"
                />
                <input
                  value={projectForm.githubLink}
                  onChange={(event) => setProjectForm((previous) => ({ ...previous, githubLink: event.target.value }))}
                  placeholder="GitHub link"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-2 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(event) => setProjectForm((previous) => ({ ...previous, featured: event.target.checked }))}
                  />
                  Featured
                </label>

                <input
                  type="number"
                  value={projectForm.order}
                  onChange={(event) => setProjectForm((previous) => ({ ...previous, order: event.target.value }))}
                  placeholder="Order"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"
                />
              </div>

              <button type="submit" className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-medium text-slate-950">
                {editingProjectId ? 'Update Project' : 'Create Project'}
              </button>
            </form>
          </section>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Blog List</h2>
              <button
                type="button"
                onClick={resetBlogForm}
                className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950"
              >
                Add Post
              </button>
            </div>

            <div className="space-y-4">
              {blogs.map((post) => (
                <div key={post._id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-white">{post.title}</p>
                    <p className="text-sm text-slate-300">{post.published ? 'Published' : 'Draft'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBlogForm({
                          title: post.title,
                          content: post.content,
                          coverImageFile: null,
                          excerpt: post.excerpt || '',
                          published: post.published,
                        });
                        setEditingBlogId(post._id);
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBlogDelete(post._id)}
                      className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <h2 className="mb-4 text-xl font-semibold text-white">
              {editingBlogId ? 'Edit Post' : 'Add Post'}
            </h2>

            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <input
                value={blogForm.title}
                onChange={(event) => setBlogForm((previous) => ({ ...previous, title: event.target.value }))}
                placeholder="Title"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"
                required
              />

              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={blogForm.published}
                  onChange={(event) => setBlogForm((previous) => ({ ...previous, published: event.target.checked }))}
                />
                Published
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(event) => setBlogForm((previous) => ({ ...previous, coverImageFile: event.target.files?.[0] || null }))}
                className="w-full rounded-2xl border border-dashed border-white/10 bg-slate-950/80 px-4 py-3 text-white"
              />

              <textarea
                value={blogForm.excerpt}
                onChange={(event) => setBlogForm((previous) => ({ ...previous, excerpt: event.target.value }))}
                placeholder="Excerpt"
                rows="3"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"
              />

              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-2 text-white">
                <ReactQuill
                  theme="snow"
                  value={blogForm.content}
                  onChange={(value) => setBlogForm((previous) => ({ ...previous, content: value }))}
                  className="text-white"
                />
              </div>

              <button type="submit" className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-medium text-slate-950">
                {editingBlogId ? 'Update Post' : 'Create Post'}
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
