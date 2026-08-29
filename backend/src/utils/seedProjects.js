/**
 * One-time seed script: inserts 9 projects into MongoDB portfolio-abhi database.
 *
 * Images are uploaded to Cloudinary from local static/img/ (with renamed filenames).
 *
 * Run from the backend/ directory:
 *   node src/utils/seedProjects.js
 *
 * Re-seed (wipes existing first):
 *   node src/utils/seedProjects.js --force
 *
 * NOTE: Eye Strain Detection has no image found in static/img/.
 * Its imageUrl will be empty — add via admin panel after providing the image.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const connectDB = require('../config/db');
const Project = require('../models/Project');

async function uploadImage(localPath) {
  if (!localPath || !fs.existsSync(localPath)) return '';
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: 'portfolio-projects',
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    });
    console.log('  Uploaded: ' + path.basename(localPath) + ' -> ' + result.secure_url);
    return result.secure_url;
  } catch (err) {
    console.warn('  Warning: Cloudinary upload failed for ' + path.basename(localPath) + ': ' + err.message);
    return '';
  }
}

const IMG_DIR = path.join(__dirname, '../../../static/img');

function imgPath(filename) {
  const full = path.join(IMG_DIR, filename);
  return fs.existsSync(full) ? full : '';
}

async function seed() {
  await connectDB();
  console.log('Connected to MongoDB.\n');

  const existing = await Project.countDocuments();
  if (existing > 0) {
    if (!process.argv.includes('--force')) {
      console.log('Warning: Database already has ' + existing + ' project(s).');
      console.log('Pass --force to wipe and re-seed.\n');
      await mongoose.disconnect();
      return;
    }
    await Project.deleteMany({});
    console.log('Cleared ' + existing + ' existing projects (--force).\n');
  }

  console.log('Uploading images to Cloudinary...');
  const brokeryImg      = await uploadImage(imgPath('brokery.png'));
  const trustFlowImg    = await uploadImage(imgPath('trustflowKYC.png'));
  const sahayaImg       = await uploadImage(imgPath('sahaya.png'));
  const mealImg         = await uploadImage(imgPath('eatit.png'));
  const tufImg          = await uploadImage(imgPath('calendar.png'));
  const financeImg      = await uploadImage(imgPath('finance_dashboard.png'));
  const bgChangerImg    = await uploadImage(imgPath('background_changer.png'));
  const currencyImg     = await uploadImage(imgPath('currency_converter.png'));
  // eye_strain: no image found on disk
  console.log('\nAll uploads complete.\n');

  const projects = [
    {
      title: 'Brokery',
      description:
        'Full-stack real estate CRM with role-based access (Admin/Broker) and a two-tier edit-approval system — sensitive fields route through admin approval via change requests with visual diffs, while low-risk fields update instantly. Includes 5 MongoDB aggregation-powered analytics dashboards, an async activity-log middleware, a collision-safe alphanumeric property code generator, and a client-property matching engine.',
      techStack: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'React', 'JWT', 'Cloudinary', 'Nodemailer', 'Vercel'],
      category: 'Web Development',
      imageUrl: brokeryImg,
      liveLink: 'https://brokery-ruddy.vercel.app/login',
      githubLink: '',
      featured: true,
      order: 1,
    },
    {
      title: 'TrustFlow KYC',
      description:
        'Decoupled KYC compliance pipeline with a database-enforced state machine (draft → submitted → under_review → approved/rejected), role-based Merchant/Reviewer flows with query-level data isolation, a FIFO reviewer queue, and client-side SLA tracking flagging applications exceeding 24-hour turnaround.',
      techStack: ['React', 'PostgreSQL', 'JWT', 'Render', 'Vercel'],
      category: 'Web Development',
      imageUrl: trustFlowImg,
      liveLink: 'https://trustflow-kyc.vercel.app/login',
      githubLink: '',
      featured: true,
      order: 2,
    },
    {
      title: 'Eye Strain Detection System',
      description:
        "Real-time desktop app monitoring eye strain via webcam at 40 FPS using MediaPipe's 468-point facial landmark model and the Eye Aspect Ratio (EAR) formula to detect blinks/closure, with a 3-frame noise filter and a personal calibration mode.",
      techStack: ['Python', 'OpenCV', 'MediaPipe', 'NumPy', 'PyInstaller'],
      category: 'Machine Learning',
      imageUrl: '',
      liveLink: '',
      githubLink: 'https://github.com/AbhiEE03/Eye_Strain_Detector',
      featured: true,
      order: 3,
    },
    {
      title: 'Sahaya',
      description:
        'Digital literacy SPA for rural India with a live banking simulator (login, fund transfer with overdraft checks, credit-based micro-loan approval, account closure) and a multilingual Botpress AI chatbot (SATHI), built framework-free for low-bandwidth networks.',
      techStack: ['JavaScript (ES6+)', 'HTML5/CSS3', 'Botpress AI', 'Netlify'],
      category: 'Web Development',
      imageUrl: sahayaImg,
      liveLink: 'https://sahaya-abhiti.netlify.app/',
      githubLink: '',
      featured: true,
      order: 4,
    },
    {
      title: 'Meal Delivery Website',
      description: 'A food delivery web app with meal browsing and ordering flow.',
      techStack: ['HTML5', 'CSS3', 'JavaScript'],
      category: 'Web Development',
      imageUrl: mealImg,
      liveLink: 'https://eatit-abhi.netlify.app/',
      githubLink: '',
      featured: false,
      order: 5,
    },
    {
      title: 'TUF Calendar',
      description: 'A calendar-based tracking tool for DSA/coding practice scheduling.',
      techStack: ['React', 'JavaScript'],
      category: 'Web Development',
      imageUrl: tufImg,
      liveLink: 'https://tuf-calendar-smoky.vercel.app/',
      githubLink: '',
      featured: false,
      order: 6,
    },
    {
      title: 'Finance Dashboard',
      description: 'A personal finance dashboard visualizing income, expenses, and balance breakdowns.',
      techStack: ['React', 'JavaScript'],
      category: 'Web Development',
      imageUrl: financeImg,
      liveLink: 'https://finance-db-ebon.vercel.app/',
      githubLink: '',
      featured: false,
      order: 7,
    },
    {
      title: 'Background Changer',
      description: 'A browser-based tool for changing image backgrounds.',
      techStack: ['React', 'JavaScript'],
      category: 'Web Development',
      imageUrl: bgChangerImg,
      liveLink: 'https://bgchangerabhi.vercel.app/',
      githubLink: '',
      featured: false,
      order: 8,
    },
    {
      title: 'Currency Converter',
      description: 'A simple real-time currency conversion utility.',
      techStack: ['React', 'JavaScript'],
      category: 'Web Development',
      imageUrl: currencyImg,
      liveLink: 'https://currencyconverterabhi.vercel.app/',
      githubLink: '',
      featured: false,
      order: 9,
    },
  ];

  const inserted = await Project.insertMany(projects);
  console.log('Seeded ' + inserted.length + ' projects successfully.\n');

  const noImg = inserted.filter((p) => !p.imageUrl);
  if (noImg.length > 0) {
    console.log('Projects with no image (add via admin panel):');
    noImg.forEach((p) => console.log('  - ' + p.title));
    console.log('');
  }

  await mongoose.disconnect();
  console.log('Done. MongoDB disconnected.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
