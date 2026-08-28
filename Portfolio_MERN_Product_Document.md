# Portfolio_abhi → MERN Revamp — Product Document

**Owner:** Abhishek Kumar
**Current live site:** https://portfolio-abhi-aayp.vercel.app/ (Flask + static HTML/CSS/JS, no DB)
**Goal:** Rebuild as a MERN stack app with Tailwind CSS, dynamic content via a simple CMS (Projects + Blog), admin login, keeping the **same live URL**.

---

## 1. What's changing vs. what stays

| Area | Current | New |
|---|---|---|
| Frontend | Static HTML/CSS/JS via Flask templates | React (Vite) + Tailwind CSS |
| Skills section | Percentage progress bars | Grid of skill logos + names |
| Projects | Hardcoded in HTML | Stored in MongoDB, editable from admin panel (CMS) |
| Blog | Placeholder Flask routes only, no real content | Full blog with list + post pages, editable from admin panel (CMS) |
| Coding Profiles | Doesn't exist | New section: Codeforces, LeetCode, GeeksforGeeks, GitHub contribution graph |
| Contact | Static form + socials | **Kept as-is visually**, made functional (see §3.7) |
| Auth | None | Single hardcoded admin, JWT login, protects write APIs |
| Backend | Flask (barely used) | Node.js + Express + MongoDB (Atlas) |
| Images | Local `/static/img` | Cloudinary |
| Hosting | Vercel (Flask) | Frontend → **same Vercel project/URL**, Backend → Render, DB → MongoDB Atlas |

Design direction: **dark, modern, glassmorphism/gradient style** (per your choice).

---

## 2. Site map / sections

1. **Navbar** — sticky, glass blur background, links to sections + "Blog" as a real route
2. **Hero** — name, roles, CTA buttons (kept, restyled)
3. **About** — kept, restyled
4. **Skills** — **redesigned**: responsive grid of tech logos + names instead of % bars, grouped loosely (Languages, Frontend, Backend, Tools/DB) — optional grouping, simple is fine
5. **Coding Profiles** *(new)* — cards for Codeforces (max rating 1246, Pupil), LeetCode (1509 contest rating, 200+ DSA problems solved), GeeksforGeeks (link to profile + leaderboard), GitHub (contribution graph image via `github-readme-stats` / `ghchart`), each linking out to the real profile. 2-3 top achievements (Ideathon 1st Prize – TechNox 2026, USACO Guide 70+ problems, BIS Hackathon 2nd position) shown as small badges/chips within this same section instead of a separate Achievements section, per your call.
6. **Experience & Education timeline** — kept, restyled
7. **Projects** — dynamic, filterable (All / Web Dev / ML / UI-UX, same categories as now), each project has: title, description, tech tags, image (Cloudinary), live link, optional GitHub link
8. **Blog** *(new)* — `/blog` list page (title, cover image, excerpt, date) + `/blog/:slug` post page rendering rich text
9. **Contact** — kept visually, backend wired so the form actually sends you an email (Nodemailer via your Gmail or Resend/EmailJS) instead of doing nothing
10. **Footer** — kept, restyled
11. **Admin (not public-facing nav)** — `/admin/login`, `/admin/dashboard` with tabs: Projects (CRUD + image upload), Blog (CRUD + rich text editor)

### Other suggestions (optional, flagged per-phase so you can skip any)
- Resume download button pinned in navbar/hero (you already reference "My Resume" — make it an actual PDF link)
- Subtle scroll-reveal animations (Framer Motion) — used sparingly, not on every element
- Project detail as a modal or dedicated page instead of just an image lightbox
- SEO basics: page titles, meta description, Open Graph image, favicon
- 404 page for unknown routes
- Loading skeletons for Projects/Blog while fetching from API
- Blog posts get simple tags/categories for future filtering (optional, can skip for v1)

---

## 3. Architecture

### 3.1 Repo structure (monorepo)
```
portfolio-abhi/
├── frontend/              # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── sections/
│   │   ├── admin/
│   │   ├── api/           # axios instance + API calls
│   │   ├── assets/
│   │   └── App.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── vercel.json
├── backend/               # Node + Express
│   ├── src/
│   │   ├── models/        # Project.js, BlogPost.js
│   │   ├── routes/        # projects.js, blog.js, auth.js, contact.js
│   │   ├── controllers/
│   │   ├── middleware/    # auth.js (JWT verify)
│   │   ├── config/        # db.js, cloudinary.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

### 3.2 Data models

**Project**
```
title: String
description: String
techStack: [String]
category: String        // "Web Development" | "Machine Learning" | "UI/UX Designing"
imageUrl: String         // Cloudinary URL
liveLink: String
githubLink: String (optional)
featured: Boolean (default false)
order: Number (for manual sorting)
createdAt: Date
```

**BlogPost**
```
title: String
slug: String (unique, auto-generated from title)
coverImageUrl: String    // Cloudinary URL
content: String          // HTML from rich text editor
excerpt: String          // short auto-generated or manual summary
published: Boolean (default true)
createdAt: Date
updatedAt: Date
```

**Admin auth** — no DB table needed. `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` (bcrypt) live in backend `.env`. Login route checks credentials against env vars and issues a JWT.

### 3.3 API endpoints

```
POST   /api/auth/login              -> { token }

GET    /api/projects                -> public, list all
POST   /api/projects                -> admin only
PUT    /api/projects/:id            -> admin only
DELETE /api/projects/:id            -> admin only

GET    /api/blog                    -> public, list published posts
GET    /api/blog/:slug              -> public, single post
POST   /api/blog                    -> admin only
PUT    /api/blog/:id                -> admin only
DELETE /api/blog/:id                -> admin only

POST   /api/upload                  -> admin only, image -> Cloudinary, returns URL

POST   /api/contact                 -> public, sends you an email

GET    /api/coding-stats            -> optional: proxy/cache calls to Codeforces & LeetCode public APIs so the frontend doesn't call third-party APIs directly (avoids CORS issues)
```

### 3.4 Auth flow
- Single admin, credentials in backend `.env`.
- `/api/auth/login` verifies email + bcrypt-compares password → returns JWT (7-day expiry).
- Frontend stores JWT in `localStorage` (fine for a single-admin personal site) and sends it as `Authorization: Bearer <token>` on admin requests.
- `middleware/auth.js` verifies JWT on all admin-only routes.
- `/admin/dashboard` route in React is a protected route — redirects to `/admin/login` if no valid token.

### 3.5 Coding profile stats
- **Codeforces** (handle **abhisheknoni78**, profile: https://codeforces.com/profile/abhisheknoni78): free public API (`codeforces.com/api/user.info?handles=abhisheknoni78`) — call from backend, cache in memory/DB for a few hours, expose via `/api/coding-stats`. Current live rating: **1250 (Pupil)**.
- **LeetCode** (profile: https://leetcode.com/u/abhiee03/): no official public API; use a well-known community proxy (e.g. `leetcode-stats-api` style approach) from the backend, same caching idea. Seed/fallback value: **1509 contest rating, 200+ DSA problems solved**.
- **GeeksforGeeks**: profile → `https://www.geeksforgeeks.org/profile/abhishekhtxm`, leaderboard → `https://practice.geeksforgeeks.org/leaderboard`. No stable public API — v1 is a static link-out card (profile + leaderboard buttons) with numbers you update manually from the admin panel later if needed, no live-fetch required.
- **GitHub**: use `github-readme-stats` / `ghchart.rshah.org` image embeds — zero backend work, just an `<img>` tag with your username (`AbhiEE03`).
- **Achievement badges** (folded into this section, not a separate section): Ideathon – TechNox 2026 (1st Prize), USACO Guide (70+ problems, Bronze/Silver), BIS Hackathon (2nd position) — rendered as small chips/pills under the coding profile cards.

### 3.6 Image uploads
- Cloudinary account (free tier). Backend gets `multer` (memory storage) → uploads buffer to Cloudinary → returns secure URL → URL saved on the Project/BlogPost document.

### 3.7 Contact form
- Keep the exact current visual design.
- Backend `/api/contact` route uses **Nodemailer** with a Gmail App Password (simplest, free) to email form submissions straight to `abhisheknoni78@gmail.com`. Alternative if Gmail App Passwords are a hassle: Resend or EmailJS (frontend-only, no backend route needed) — we'll pick one in Phase 10.

### 3.8 Deployment
- **Backend** → Render (free web service), env vars set in Render dashboard: `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `CLOUDINARY_*`, `EMAIL_*`.
- **Database** → MongoDB Atlas free cluster.
- **Frontend** → deployed to the **same existing Vercel project** so the URL `portfolio-abhi-aayp.vercel.app` doesn't change. In Vercel project settings, change the framework preset from "Other/Python" to "Vite", set root directory to `frontend/`, and set `VITE_API_URL` env var to your Render backend URL.
- Vercel `frontend/vercel.json` — SPA rewrite so React Router routes (like `/blog/:slug`, `/admin/dashboard`) don't 404 on refresh.

---

## 4. Environment variables

**backend/.env**
```
PORT=5000
MONGO_URI=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_APP_PASSWORD=
CLIENT_URL=
```

**frontend/.env**
```
VITE_API_URL=
```

---

## 5. Phased execution plan

Work through these **in order**. For each phase, just tell me the phase number and paste the corresponding prompt block below into GitHub Copilot Chat in VS Code (Agent/Edit mode), inside your `portfolio-abhi` repo. Each prompt assumes prior phases are done.

---

### Phase 0 — Repo & tooling setup
**Goal:** Scaffold the monorepo, no features yet.

> **Copilot prompt — Phase 0:**
> "Set up a monorepo called `portfolio-abhi` with two folders: `frontend` and `backend`. In `frontend`, scaffold a React app using Vite with Tailwind CSS installed and configured (tailwind.config.js, index.css with @tailwind directives). In `backend`, initialize a Node.js project with Express, set up a basic `src/server.js` that starts an Express server on `process.env.PORT || 5000` with a single `GET /api/health` route returning `{status: 'ok'}`, use `dotenv` for env vars, and add `nodemon` as a dev dependency with a `dev` script. Add a root `.gitignore` covering `node_modules`, `.env`, and build folders. Add a root `README.md` describing the project structure."

---

### Phase 1 — Backend foundation & MongoDB connection
**Goal:** Connect to MongoDB Atlas, folder structure for models/routes/controllers.

> **Copilot prompt — Phase 1:**
> "In the `backend` folder, create `src/config/db.js` that connects to MongoDB using Mongoose and the `MONGO_URI` env var, with clear console logs on success/failure and exiting the process on failure. Wire this into `src/server.js` so it connects on startup. Create empty folders/files: `src/models/`, `src/routes/`, `src/controllers/`, `src/middleware/`. Add a `.env.example` file listing all env vars we'll need: `PORT, MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD_HASH, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, EMAIL_USER, EMAIL_APP_PASSWORD, CLIENT_URL`. Also add `cors` middleware in `server.js` configured to allow requests from `process.env.CLIENT_URL`."

---

### Phase 2 — Database models
**Goal:** Mongoose schemas for Project and BlogPost.

> **Copilot prompt — Phase 2:**
> "Create `backend/src/models/Project.js` as a Mongoose model with fields: title (String, required), description (String, required), techStack ([String]), category (String, enum: ['Web Development','Machine Learning','UI/UX Designing'], required), imageUrl (String), liveLink (String), githubLink (String), featured (Boolean, default false), order (Number, default 0), timestamps true. Create `backend/src/models/BlogPost.js` with fields: title (String, required), slug (String, required, unique), coverImageUrl (String), content (String, required — will hold HTML from a rich text editor), excerpt (String), published (Boolean, default true), timestamps true. Add a pre-save hook on BlogPost that auto-generates `slug` from `title` (lowercase, hyphenated) if slug isn't already set."

---

### Phase 3 — Auth (single admin, JWT)
**Goal:** Login route + protect middleware.

> **Copilot prompt — Phase 3:**
> "Create `backend/src/routes/auth.js` with a `POST /api/auth/login` route that accepts `{ email, password }`, compares `email` to `process.env.ADMIN_EMAIL` and `password` (bcrypt.compare) to `process.env.ADMIN_PASSWORD_HASH`, and on success returns a JWT signed with `process.env.JWT_SECRET` expiring in 7 days, containing `{ email }` in the payload. Return 401 on mismatch. Create `backend/src/middleware/auth.js` exporting a middleware function that reads the `Authorization: Bearer <token>` header, verifies the JWT, and either calls `next()` or returns 401. Mount the auth route in `server.js` under `/api/auth`. Also create a small one-off Node script `backend/src/utils/generateHash.js` that takes a plaintext password as a CLI arg and prints its bcrypt hash, so I can generate `ADMIN_PASSWORD_HASH` myself."

---

### Phase 4 — Projects API + Cloudinary upload
**Goal:** Full CRUD for projects, admin-protected writes, image upload.

> **Copilot prompt — Phase 4:**
> "Set up Cloudinary in `backend/src/config/cloudinary.js` using env vars `CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET`. Create `backend/src/routes/upload.js` with a `POST /api/upload` route protected by the auth middleware, using `multer` with memory storage to accept a single image file field named `image`, upload its buffer to Cloudinary, and return `{ url: secure_url }`. Create `backend/src/controllers/projectController.js` and `backend/src/routes/projects.js` implementing: `GET /api/projects` (public, list all sorted by `order` then `createdAt` desc), `POST /api/projects` (admin only, create), `PUT /api/projects/:id` (admin only, update), `DELETE /api/projects/:id` (admin only, delete). Mount both routes in `server.js` under `/api/upload` and `/api/projects`."

---

### Phase 5 — Blog API
**Goal:** Full CRUD for blog posts, admin-protected writes.

> **Copilot prompt — Phase 5:**
> "Create `backend/src/controllers/blogController.js` and `backend/src/routes/blog.js` implementing: `GET /api/blog` (public, list only `published: true` posts, sorted by `createdAt` desc, excluding full `content` field to keep the list light — just title, slug, coverImageUrl, excerpt, createdAt), `GET /api/blog/:slug` (public, full post including content), `POST /api/blog` (admin only, create — auto-generate excerpt from content if not provided by stripping HTML tags and truncating to ~150 chars), `PUT /api/blog/:id` (admin only, update), `DELETE /api/blog/:id` (admin only, delete). Mount the route in `server.js` under `/api/blog`."

---

### Phase 6 — Frontend foundation & design system
**Goal:** Routing, layout shell, Tailwind theme (dark glassmorphism), fonts.

> **Copilot prompt — Phase 6:**
> "In the `frontend` React + Vite + Tailwind project, install and configure `react-router-dom`. Set up routes in `App.jsx`: `/` (Home), `/blog` (BlogList), `/blog/:slug` (BlogPost), `/admin/login` (AdminLogin), `/admin/dashboard` (AdminDashboard, wrapped in a `ProtectedRoute` component that checks for a JWT in localStorage and redirects to `/admin/login` if missing), and a catch-all `*` (NotFound page). Extend `tailwind.config.js` with a dark glassmorphism design system: a dark navy/near-black background color, 1-2 accent gradient colors (e.g. violet-to-cyan), custom `backdrop-blur` utility usage conventions, and add a modern sans-serif Google Font (e.g. 'Space Grotesk' for headings, 'Inter' for body) loaded via `index.html` and set as Tailwind `fontFamily`. Create a shared `Navbar` component (sticky, translucent/blurred background, links to Home sections + Blog) and `Footer` component matching this same dark glass style, and an `axios` instance in `src/api/axios.js` pointing to `import.meta.env.VITE_API_URL`, automatically attaching the JWT from localStorage as a Bearer token if present."

---

### Phase 7 — Hero, About, Skills, Coding Profiles, Experience sections
**Goal:** Rebuild the static sections with new design; Skills as logos, new Coding Profiles section.

> **Copilot prompt — Phase 7:**
> "Create the following components in `frontend/src/sections/`, styled with the dark glassmorphism Tailwind theme from Phase 6, and assemble them on the Home page in this order: Hero, About, Skills, CodingProfiles, Experience.
> - `Hero.jsx`: name 'Abhishek Kumar', roles 'Web Developer, UI/UX Designer, Competitive Programmer', a short intro line, 'Hire Me' (mailto) and 'Contact Me' (scroll to contact) buttons, and a 'My Resume' button linking to a static PDF at `/resume.pdf`.
> - `About.jsx`: short bio placeholder, editable later.
> - `Skills.jsx`: a responsive grid of skill cards — each card shows a technology logo icon (use the `react-icons` package, e.g. `react-icons/si`/`react-icons/di` for brand logos, generic icon fallback where no exact logo exists) and the skill name below it, NOT a percentage bar. Optionally group into subtle labeled clusters: Languages (C, C++, Python, JavaScript, Go, MATLAB), Frontend (React, HTML5, CSS3, Tailwind CSS, Bootstrap, Vite), Backend & Databases (Node.js, Express.js, MongoDB, PostgreSQL, GraphQL), ML & Data/CV (NumPy, Pandas, Scikit-learn, OpenCV, MediaPipe), Tools & Platforms (Git/GitHub, Docker, JWT, Cloudinary, Vercel, Render).
> - `CodingProfiles.jsx`: a row of cards for Codeforces, LeetCode, GeeksforGeeks, and GitHub. Codeforces card shows 'Rating: 1250 (Pupil)' and links to `https://codeforces.com/profile/abhisheknoni78`. LeetCode card shows '1509 contest rating · 200+ problems solved' and links to `https://leetcode.com/u/abhiee03/`. GeeksforGeeks card links out to `https://www.geeksforgeeks.org/profile/abhishekhtxm` and `https://practice.geeksforgeeks.org/leaderboard` (two buttons: Profile, Leaderboard), no live stats needed. GitHub card embeds a contribution graph image using `https://ghchart.rshah.org/AbhiEE03` and links to `https://github.com/AbhiEE03`. Below the four cards, render a row of small achievement badge/pill components: 'Ideathon – TechNox 2026: 1st Prize', 'USACO Guide: 70+ problems solved', 'BIS Hackathon: 2nd Position'. Style all of this consistently with the Skills cards.
> - `Experience.jsx`: a vertical timeline listing (in reverse chronological order) the items: Student Placement Coordinator (TnP Cell, NIT Mizoram, May 2026–Present — facilitating campus recruitment drives, primary point of contact for visiting companies), Backend Engineering Intern (7Hills Nexgram/7HNG, Chennai, Hybrid, June 2026–Present — built a tenant lifecycle system in Go/PostgreSQL, API key management, GraphQL API design), Web Development Intern (SkillCraft Technology, Mumbai, Dec 2025–Jan 2026 — delivered 4 production-ready projects), Campus Ambassador (NxtWave, Aug 2025–Present — organised OpenAI × NxtWave hackathon and institute-wide DSA contest), Assistant Student Activity Coordinator (TnP Cell, NIT Mizoram, May 2025–May 2026 — coordinated Viksit Bharat@2047, Orientation Program, Convocation, Fresher's Party), Executive Member (Think India, NIT Mizoram, Dec 2024–Present — delegate at Think India Convention IIT Roorkee 2024 and Northeast Summit IIT Guwahati 2025), Contributor@GSSOC (GirlScript Summer of Code, July–Dec 2025), B.Tech — EE Major/AIML Minor (NIT Mizoram, 2023–2027, CGPA 8.44), Higher Secondary (Vivekanand Public School, Warisaliganj, Bihar, CBSE, 86.4%, 2022) — each with title, subtitle/org, date range, and a one-line description as noted above."

---

### Phase 8 — Dynamic Projects page
**Goal:** Fetch projects from API, filter tabs, detail view.

> **Copilot prompt — Phase 8:**
> "Create `frontend/src/sections/Projects.jsx` that fetches from `GET /api/projects` on mount using the shared axios instance, shows a loading skeleton while fetching, and renders filter tabs: All, Web Development, Machine Learning, UI/UX Designing — clicking a tab filters the already-fetched list client-side. Show `featured: true` projects first (slightly larger card or a small 'Featured' badge), rest in normal grid order. Each project renders as a glass-style card with its `imageUrl`, `title`, `techStack` as small tags, and a '+' icon that opens a modal (`ProjectModal.jsx`) showing the full description, tech stack, and buttons linking to `liveLink` and `githubLink` (hide the GitHub button if `githubLink` is empty). Match the dark glassmorphism style from earlier phases."

**Note:** Projects.jsx just renders whatever is in the database — it doesn't need hardcoded data. Once Phase 11 (admin panel) is done, add your 9 real projects through the admin UI using the ready-to-paste data in **Appendix A** below, so you don't have to re-type descriptions/tech stacks from your CV.

---

### Phase 9 — Blog pages
**Goal:** Blog list + single post page.

> **Copilot prompt — Phase 9:**
> "Create `frontend/src/pages/BlogList.jsx` that fetches `GET /api/blog`, shows a loading skeleton, and renders a responsive grid of post cards (coverImageUrl, title, excerpt, formatted createdAt date), each linking to `/blog/:slug`. Create `frontend/src/pages/BlogPost.jsx` that reads the slug from the URL, fetches `GET /api/blog/:slug`, and renders the cover image, title, date, and the post's `content` field safely as HTML (use a safe method like `dangerouslySetInnerHTML` since content only ever comes from my own admin panel). Add a 'Back to Blog' link. Style both pages consistently with the rest of the dark glass theme."

---

### Phase 10 — Contact (functional) + Footer
**Goal:** Wire up the existing contact form design to actually send emails; keep the visual design unchanged.

> **Copilot prompt — Phase 10:**
> "Recreate the existing Contact section (Name, Email, Subject, Message fields + Send button, plus the sidebar showing location 'Patna, Bihar, India', email 'abhisheknoni78@gmail.com', and social links to X, GitHub, LinkedIn) as `frontend/src/sections/Contact.jsx`, keeping the same visual layout, restyled to match the dark glass theme. On submit, POST the form data to `${VITE_API_URL}/api/contact`, show a success/error toast or inline message, and reset the form on success. In the backend, create `backend/src/routes/contact.js` with `POST /api/contact` that uses Nodemailer with a Gmail transporter (`EMAIL_USER`, `EMAIL_APP_PASSWORD` env vars) to send an email to `abhisheknoni78@gmail.com` containing the submitted name, email, subject, and message. Also create `frontend/src/components/Footer.jsx` matching the current footer content (copyright + 'Designed By Abhishek Kumar' link), styled to match the theme."

---

### Phase 11 — Admin panel
**Goal:** Login + dashboard with CRUD UI for Projects and Blog.

> **Copilot prompt — Phase 11:**
> "Create `frontend/src/admin/AdminLogin.jsx`: a simple centered card with email + password fields, on submit POSTs to `/api/auth/login`, stores the returned token in `localStorage`, and redirects to `/admin/dashboard` on success, showing an error message on failure. Create `frontend/src/admin/AdminDashboard.jsx` with two tabs, 'Projects' and 'Blog'. In the Projects tab: a table/list of existing projects (fetched from `GET /api/projects`) with Edit and Delete buttons, and an 'Add Project' button opening a form (title, description, techStack as comma-separated input converted to an array, category dropdown, image file upload calling `POST /api/upload` first then saving the returned URL, liveLink, githubLink) that POSTs to `/api/projects` (or PUTs when editing). In the Blog tab: similarly list existing posts with Edit/Delete, and an 'Add Post' button opening a form with title, cover image upload, and a rich text editor for `content` (use the `react-quill` package for a simple WYSIWYG editor), submitting to `/api/blog`. Both forms should send the JWT via the shared axios instance. Add a 'Logout' button that clears localStorage and redirects to `/admin/login`."

---

### Phase 12 — Polish
**Goal:** Animations, SEO, responsiveness pass, error pages.

> **Copilot prompt — Phase 12:**
> "Add `framer-motion` and apply subtle fade/slide-in scroll animations to each major section on the Home page (Hero, About, Skills, CodingProfiles, Experience, Projects, Contact) — keep it subtle, not on every individual element. Add a `NotFound.jsx` page styled to match the theme for the `*` route. Add proper `<title>` and meta description tags per page using `react-helmet-async` (Home: portfolio intro; Blog list: 'Blog — Abhishek Kumar'; Blog post: use the post title). Do a responsiveness pass across all new sections and the admin dashboard for mobile widths (375px) and tablet (768px), fixing any overflow or cramped spacing issues. Add a favicon and an Open Graph image reference in `index.html`."

---

### Phase 13 — Deployment
**Goal:** Backend on Render, frontend on the same existing Vercel project/URL.

> **Copilot prompt — Phase 13:**
> "Create `frontend/vercel.json` with a rewrite rule so all routes fall back to `index.html` for client-side routing (SPA rewrite for React Router). Create a `backend/README-DEPLOY.md` with step-by-step instructions for deploying the `backend` folder to Render as a Web Service (build command `npm install`, start command `node src/server.js`, and the list of required environment variables). Also create a root `DEPLOY.md` explaining: (1) how to update the existing Vercel project's settings to build from the `frontend` folder using the Vite framework preset instead of the old Python/Flask setup, (2) that `VITE_API_URL` in Vercel's environment variables must point to the Render backend's live URL, and (3) that no domain change is needed since we're redeploying into the same Vercel project."

---

## 6. Appendix A — Project seed data (paste into admin panel in Phase 11)

**Featured (flagship, from your CV):**

1. **Brokery — Real Estate CRM Platform**
   - Category: Web Development · Featured: true
   - Tech: Node.js, Express, MongoDB, Mongoose, React, JWT, Cloudinary, Nodemailer, Vercel
   - Description: Full-stack real estate CRM with role-based access (Admin/Broker) and a two-tier edit-approval system — sensitive fields route through admin approval via change requests with visual diffs, while low-risk fields update instantly. Includes 5 MongoDB aggregation-powered analytics dashboards, an async activity-log middleware, a collision-safe alphanumeric property code generator, and a client-property matching engine.
   - Live link: https://brokery-ruddy.vercel.app/login

2. **TrustFlow KYC — Merchant Onboarding & Compliance System**
   - Category: Web Development · Featured: true
   - Tech: React, PostgreSQL, JWT, Render, Vercel
   - Description: Decoupled KYC compliance pipeline with a database-enforced state machine (draft → submitted → under_review → approved/rejected), role-based Merchant/Reviewer flows with query-level data isolation, a FIFO reviewer queue, and client-side SLA tracking flagging applications exceeding 24-hour turnaround.
   - Live link: https://trustflow-kyc.vercel.app/login

3. **Eye Strain Detection System — Real-Time Computer Vision Desktop App**
   - Category: Machine Learning · Featured: true
   - Tech: Python, OpenCV, MediaPipe, NumPy, PyInstaller
   - Description: Real-time desktop app monitoring eye strain via webcam at 40 FPS using MediaPipe's 468-point facial landmark model and the Eye Aspect Ratio (EAR) formula to detect blinks/closure, with a 3-frame noise filter and a personal calibration mode.
   - GitHub link: https://github.com/AbhiEE03/Eye_Strain_Detector

4. **Sahaya — Rural Financial Inclusion Platform**
   - Category: UI/UX Designing (or Web Development, your call) · Featured: true
   - Tech: JavaScript (ES6+), HTML5/CSS3, Botpress AI, Netlify
   - Description: Digital literacy SPA for rural India with a live banking simulator (login, fund transfer with overdraft checks, credit-based micro-loan approval, account closure) and a multilingual Botpress AI chatbot (SATHI), built framework-free for low-bandwidth networks.
   - Live link: https://sahaya-abhiti.netlify.app/

**Existing smaller projects (kept per your choice):**

5. **Meal Delivery Website** — Category: Web Development — Live: https://eatit-abhi.netlify.app/
6. **TUF Calendar** — Category: Web Development — Live: https://tuf-calendar-smoky.vercel.app/
7. **Finance Dashboard** — Category: Web Development — Live: https://finance-db-ebon.vercel.app/
8. **Background Changer** — Category: Web Development — Live: https://bgchangerabhi.vercel.app/
9. **Currency Converter** — Category: Web Development — Live: https://currencyconverterabhi.vercel.app/

*(For 5–9, port over whatever short description/tech stack you already had, or a one-liner is fine — these are supporting projects, not the focus.)*

---

## 7. Appendix B — Full skills list (from CV, for Phase 7)

- **Languages:** C, C++, Python, JavaScript (ES6+), Go, MATLAB
- **Frontend:** React.js, HTML5/CSS3, Tailwind CSS, Bootstrap, Vite
- **Backend & Databases:** Node.js, Express.js, MongoDB, Mongoose, PostgreSQL, SQL, GraphQL, pgx/v5, Goose
- **Systems & Architecture:** Multi-tenant Architecture, Event-Driven Systems, State Machines, Database Transactions, RESTful & GraphQL API Design
- **ML & Data / CV:** NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn, OpenCV, MediaPipe
- **Tools & Platforms:** Git/GitHub, Docker, Temporal.io, Linux/Bash, JWT, REST APIs, Cloudinary, Netlify, Vercel, Render, PyInstaller, VS Code, PyCharm, LaTeX, Canva

For the Skills grid, showing all of these is a lot — consider showing your strongest/most relevant ~16-20 (drop things like LaTeX/Canva/PyCharm which are tools, not "skills" in the portfolio sense) and letting the rest live only on your resume PDF.

---

## 8. Order of operations summary

0 → Scaffold → 1 → DB connect → 2 → Models → 3 → Auth → 4 → Projects API/Cloudinary → 5 → Blog API → 6 → Frontend shell/theme → 7 → Static sections (incl. new Skills + Coding Profiles) → 8 → Dynamic Projects → 9 → Blog pages → 10 → Contact + Footer → 11 → Admin panel → 12 → Polish → 13 → Deploy

Just tell me a phase number whenever you're ready, and I'll help you troubleshoot whatever Copilot produces for that phase before moving to the next one.
