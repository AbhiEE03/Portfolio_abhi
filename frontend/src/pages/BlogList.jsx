import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/api/blog');
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="py-12 md:py-20">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Blog</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-white md:text-5xl">Insights & experiments</h1>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
              <div className="h-52 rounded-2xl bg-slate-800/80" />
              <div className="mt-4 h-4 w-1/3 rounded bg-slate-700/80" />
              <div className="mt-3 h-5 w-3/4 rounded bg-slate-700/80" />
              <div className="mt-2 h-4 w-full rounded bg-slate-700/80" />
              <div className="mt-2 h-4 w-5/6 rounded bg-slate-700/80" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article key={post._id} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-xl">
              <img
                src={post.coverImageUrl || 'https://placehold.co/1200x800/0f172a/94a3b8?text=Blog+Post'}
                alt={post.title}
                className="h-52 w-full object-cover"
              />

              <div className="space-y-4 p-5">
                <p className="text-sm text-cyan-300">{formatDate(post.createdAt)}</p>
                <Link to={`/blog/${post.slug}`} className="block text-2xl font-semibold text-white transition hover:text-cyan-200">
                  {post.title}
                </Link>
                <p className="text-slate-300">{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-sm font-medium text-cyan-300 hover:text-cyan-200">
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
