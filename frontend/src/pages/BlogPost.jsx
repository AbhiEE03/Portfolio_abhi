import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../api/axios';
import PageMeta from '../components/PageMeta';
import { blogPostSchema } from '../config/structuredData';
import { formatLongDate as formatDate, normalizeContent, readPrerendered } from '../utils/blog';
import { bannerUrl } from '../utils/cloudinary';

export default function BlogPost() {
  const { slug } = useParams();
  // On a prerendered /blog/<slug> page the post is embedded in the HTML, so the
  // first render shows it straight away; the fetch below then refreshes it quietly.
  const [post, setPost] = useState(() => readPrerendered(`post:${slug}`));
  const [loading, setLoading] = useState(() => !readPrerendered(`post:${slug}`));

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/api/blog/${slug}`);
        setPost(data);
      } catch (error) {
        // Keeps showing the embedded copy, if there is one.
        console.error('Failed to fetch blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-3xl animate-pulse rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-10">
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
      <>
        <PageMeta title="Post Not Found — Abhishek Kumar" noindex />
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-slate-200 backdrop-blur-xl">
            <h1 className="text-3xl font-bold text-white">Post not found</h1>
            <p className="mt-3 text-slate-300">The blog post you are looking for does not exist.</p>
            <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200">
              <FiArrowLeft />
              Back to Blog
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`${post.title} — Abhishek Kumar`}
        description={post.excerpt || 'Blog post by Abhishek Kumar.'}
        path={`/blog/${post.slug}`}
        image={post.coverImageUrl}
        type="article"
        publishedTime={post.createdAt}
        modifiedTime={post.updatedAt || post.createdAt}
        jsonLd={blogPostSchema(post)}
      />
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <article className="mx-auto max-w-3xl py-12 md:py-16">
          <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200">
            <FiArrowLeft />
            Back to Blog
          </Link>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl">
            {post.coverImageUrl && (
              <img
                src={bannerUrl(post.coverImageUrl)}
                // Without a written description the banner only repeats the h1 below,
                // so it is marked decorative rather than given a generic alt.
                alt={post.coverImageAlt || ''}
                width="1200"
                height="630"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="aspect-[1200/630] h-auto w-full object-cover"
              />
            )}

            <div className="space-y-6 p-6 md:p-10">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">{formatDate(post.createdAt)}</p>
                <h1 className="mt-4 break-words font-display text-3xl font-bold text-white md:text-5xl">{post.title}</h1>
              </div>

              <div
                className="blog-content prose prose-invert max-w-none text-slate-200 prose-headings:font-display prose-a:text-cyan-300 prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: normalizeContent(post.content) }}
              />
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
