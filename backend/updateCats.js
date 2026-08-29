require('dotenv').config({path:'./.env'});
const mongoose = require('mongoose');
const Project = require('./src/models/Project');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const res = await Project.updateMany(
    { title: { $in: ['Meal Delivery Website', 'TUF Calendar', 'Background Changer', 'Currency Converter'] } },
    { $set: { category: 'UI/UX Designing' } }
  );
  console.log('Updated categories:', res.modifiedCount);
  await mongoose.disconnect();
}
run();
