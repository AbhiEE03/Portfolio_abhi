import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
  absoluteUrl,
} from './site';

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const personSchema = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: SITE_NAME,
  url: SITE_URL,
  image: DEFAULT_OG_IMAGE,
  jobTitle: 'Full-Stack Developer',
  description: SITE_DESCRIPTION,
  sameAs: SOCIAL_PROFILES,
  knowsAbout: [
    'JavaScript',
    'React',
    'Node.js',
    'Express',
    'MongoDB',
    'Python',
    'Data Structures and Algorithms',
    'Competitive Programming',
  ],
};

export const websiteSchema = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: 'en',
  publisher: { '@id': PERSON_ID },
};

/** Home page: Person + WebSite + ProfilePage in one graph. */
export const homePageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    personSchema,
    websiteSchema,
    {
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: SITE_NAME,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': PERSON_ID },
      mainEntity: { '@id': PERSON_ID },
    },
  ],
};

/** Blog index page. */
export const blogListSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    personSchema,
    websiteSchema,
    {
      '@type': 'Blog',
      '@id': `${SITE_URL}/blog#blog`,
      url: `${SITE_URL}/blog`,
      name: `${SITE_NAME} — Blog`,
      description: 'Technical notes, project write-ups and programming articles by Abhishek Kumar.',
      inLanguage: 'en',
      isPartOf: { '@id': WEBSITE_ID },
      author: { '@id': PERSON_ID },
      publisher: { '@id': PERSON_ID },
    },
  ],
};

/** Single blog post: BlogPosting + breadcrumb trail. */
export const blogPostSchema = (post) => {
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      personSchema,
      {
        '@type': 'BlogPosting',
        '@id': `${url}#post`,
        headline: post.title,
        description: post.excerpt || SITE_DESCRIPTION,
        image: post.coverImageUrl ? absoluteUrl(post.coverImageUrl) : DEFAULT_OG_IMAGE,
        url,
        mainEntityOfPage: url,
        datePublished: post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
        inLanguage: 'en',
        author: { '@id': PERSON_ID },
        publisher: { '@id': PERSON_ID },
        isPartOf: { '@id': `${SITE_URL}/blog#blog` },
      },
      {
        '@type': 'Blog',
        '@id': `${SITE_URL}/blog#blog`,
        url: `${SITE_URL}/blog`,
        name: `${SITE_NAME} — Blog`,
        publisher: { '@id': PERSON_ID },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
};
