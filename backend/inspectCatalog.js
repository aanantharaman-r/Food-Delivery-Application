const mongoose = require('./node_modules/mongoose');
require('./node_modules/dotenv').config({ path: './.env' });

async function inspect() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Food = require('./models/Food');
  const Category = require('./models/Category');

  const categories = await Category.find();
  console.log('--- ALL CATEGORIES ---');
  categories.forEach(c => {
    console.log(`${c._id} | ${c.name} | ${c.image}`);
  });

  const foods = await Food.find().populate('category');
  console.log('\n--- ALL FOODS (' + foods.length + ') ---');
  foods.forEach(f => {
    console.log(`${f._id} | ${f.name} | Cat: ${f.category?.name} (${f.category?._id}) | Img: ${f.image}`);
  });

  await mongoose.disconnect();
}

inspect();
