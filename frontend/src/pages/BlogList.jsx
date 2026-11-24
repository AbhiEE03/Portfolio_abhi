import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { thumbnailUrl } from '../utils/cloudinary';
import { formatShortDate as formatDate, readPrerendered } from '../utils/blog';

export default function BlogList() {
  // The prerendered /blog page embeds the post list; the fetch below refreshes it.
  const [posts, setPosts] = useState(() => readPrerendered('blog-list') || []);
  const [loading, setLoading] = useState(() => !readPrerendered('blog-list'));

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
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Blog</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-white md:text-5xl">Insights & experiments</h1>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
              <div className="aspect-[1200/630] rounded-2xl bg-slate-800/80" />
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
            <article key={post._id} className="flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-xl">
              {/* The thumbnail repeats the card's title link, so it is hidden from
                  screen readers and keyboard focus. Posts without a cover get a
                  themed placeholder so every card keeps the same height. */}
              <Link to={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true" className="block">
                {post.coverImageUrl ? (
                  <img
                    src={thumbnailUrl(post.coverImageUrl)}
                    alt=""
                    width="640"
                    height="336"
                    loading="lazy"
                    decoding="async"
                    className="aspect-[1200/630] h-auto w-full object-cover"
                  />
                ) : (
                  <div className="relative aspect-[1200/630] w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.07)_1px,transparent_1px)] bg-[size:28px_28px]" />
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/25 blur-3xl" />
                    <span className="absolute bottom-4 left-5 font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/80">Blog</span>
                  </div>
                )}
              </Link>

              <div className="flex flex-1 flex-col gap-4 p-5">
                <p className="text-sm text-cyan-300">{formatDate(post.createdAt)}</p>
                <Link to={`/blog/${post.slug}`} className="block break-words text-2xl font-semibold text-white transition hover:text-cyan-200">
                  {post.title}
                </Link>
                <p className="break-words text-slate-300">{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="mt-auto inline-flex items-center self-start text-sm font-medium text-cyan-300 hover:text-cyan-200">
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
