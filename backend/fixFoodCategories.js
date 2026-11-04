const mongoose = require('./node_modules/mongoose');
require('./node_modules/dotenv').config({ path: './.env' });

// Desired exact category for each dish:
const FOOD_CATEGORY_MAPPING = {
  // Burgers
  'Truffle Smash Cheeseburger': 'Burgers',
  'Crispy Nashville Hot Chicken Burger': 'Burgers',
  'Loaded Truffle & Bacon Fries': 'Burgers',

  // Pizza
  'Bufala Margherita D.O.P.': 'Pizza',
  'Diavola Pepperoni & Hot Honey': 'Pizza',
  'Creamy Truffle Wild Mushroom Pasta': 'Pasta', // or Pizza

  // Sushi & Asian
  'Tokyo Black Garlic Tonkotsu Ramen': 'Noodles',
  'Rainbow Dragon Maki Roll (8 pcs)': 'Rolls',

  // Biryani
  'Dum Hyderabadi Chicken Biryani': 'Biryani',
  'Royal Paneer Tikka Dum Biryani': 'Biryani',
  'Royal Subz Dum Biryani': 'Biryani',

  // Mexican / Street rolls
  'Slow-Cooked Birria Beef Tacos (3 pcs)': 'Sandwich',

  // Deserts & Sweets
  'Belgian Triple Chocolate Molten Cake': 'Cake',
  'Classic Venetian Tiramisu Jar': 'Deserts',
  'Warm Belgian Chocolate Waffles': 'Deserts',
  'Artisan Gelato Sundae Trio': 'Deserts',

  // Salad
  'Mediterranean Greek Salad': 'Salad',
  'Farm Fresh Garden Salad': 'Salad',

  // Rolls
  'Crispy Veggie Spring Rolls (4 pcs)': 'Rolls',
  'Smoked Chicken Kathi Roll': 'Rolls',
  'Paneer Tikka Frankie Roll': 'Rolls',
  'Fresh Vietnamese Avocado Spring Rolls (3 pcs)': 'Rolls',

  // Sandwich
  'Smoked Turkey & Avocado Club Sandwich': 'Sandwich',
  'Grilled Sourdough Caprese Panini': 'Sandwich',
  'Smoked BBQ Pulled Chicken Sub': 'Sandwich',
  'Cheesy Bombay Masala Toast': 'Sandwich',

  // Cake
  'Red Velvet Supreme Cream Cake': 'Cake',
  'New York Baked Blueberry Cheesecake': 'Cake',
  'Dark Chocolate Truffle Fudge Slice': 'Cake',
  'Lotus Biscoff Caramel Mousse Cake': 'Cake',

  // Pasta
  'Creamy Garlic Alfredo Penne Pasta': 'Pasta',
  'Classic Baked Lasagna Bolognese': 'Pasta',

  // Noodles
  'Spicy Dan Dan Garlic Noodles': 'Noodles',
  'Wok-Tossed Hakka Veg Noodles': 'Noodles',
  'Fiery Schezwan Chicken Noodles': 'Noodles',
  'Authentic Thai Pad Thai Noodles': 'Noodles',

  // Pure Veg
  'Shahi Paneer Butter Masala': 'Pure Veg',
  'Amritsari Dal Makhani Bowl': 'Pure Veg'
};

async function fixFoodCategories() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const Category = require('./models/Category');
  const Food = require('./models/Food');

  const categories = await Category.find();
  const catMap = {};
  categories.forEach(c => {
    catMap[c.name.toLowerCase()] = c._id;
  });

  console.log('Available Category IDs in DB:');
  console.log(catMap);

  for (const [foodName, targetCategoryName] of Object.entries(FOOD_CATEGORY_MAPPING)) {
    const targetCatId = catMap[targetCategoryName.toLowerCase()];
    if (!targetCatId) {
      console.error(`Category not found: ${targetCategoryName}`);
      continue;
    }

    const res = await Food.updateOne(
      { name: foodName },
      { $set: { category: targetCatId } }
    );
    console.log(`Updated "${foodName}" -> ${targetCategoryName} (${res.modifiedCount} modified)`);
  }

  // Verification:
  console.log('\n--- VERIFICATION OF ALL FOODS & CATEGORIES ---');
  const foods = await Food.find().populate('category');
  const countsPerCategory = {};
  foods.forEach(f => {
    const catName = f.category?.name || 'UNKNOWN';
    countsPerCategory[catName] = (countsPerCategory[catName] || 0) + 1;
    console.log(`${f.name} => ${catName}`);
  });

  console.log('\n--- ITEM COUNTS PER CATEGORY ---');
  console.log(countsPerCategory);

  await mongoose.disconnect();
}

fixFoodCategories().catch(err => {
  console.error(err);
  process.exit(1);
});

