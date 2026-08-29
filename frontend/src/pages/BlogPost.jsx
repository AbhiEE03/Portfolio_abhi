import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../api/axios';
import PageMeta from '../components/PageMeta';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/api/blog/${slug}`);
        setPost(data);
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="animate-pulse rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-10">
          <div className="h-4 w-1/4 rounded bg-slate-700/80" />
          <div className="mt-6 h-8 w-3/4 rounded bg-slate-700/80" />
          <div className="mt-6 h-72 rounded-2xl bg-slate-700/80" />
          <div className="mt-6 space-y-3">
            <div className="h-4 rounded bg-slate-700/80" />
            <div className="h-4 rounded bg-slate-700/80" />
            <div className="h-4 w-5/6 rounded bg-slate-700/80" />
          </div>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="py-16">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-slate-200 backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-white">Post not found</h1>
          <p className="mt-3 text-slate-300">The blog post you are looking for does not exist.</p>
          <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200">
            <FiArrowLeft />
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageMeta title={`${post.title} — Abhishek Kumar`} description={post.excerpt || 'Blog post by Abhishek Kumar.'} />
      <article className="py-12 md:py-16">
        <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200">
          <FiArrowLeft />
          Back to Blog
        </Link>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl">
          <img
            src={post.coverImageUrl || 'https://placehold.co/1400x700/0f172a/94a3b8?text=Blog+Cover'}
            alt={post.title}
            className="h-72 w-full object-cover md:h-96"
          />

          <div className="space-y-6 p-6 md:p-10">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">{formatDate(post.createdAt)}</p>
              <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">{post.title}</h1>
            </div>

            <div
              className="prose prose-invert max-w-none text-slate-200 prose-headings:font-display prose-a:text-cyan-300 prose-strong:text-white"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </article>
    </>
  );
}
