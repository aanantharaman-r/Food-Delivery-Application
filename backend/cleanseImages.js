const mongoose = require('./node_modules/mongoose');
require('./node_modules/dotenv').config({ path: './.env' });

// 1. DEDICATED, DISTINCT CATEGORY IMAGES (Representing categories in circular filters)
const CATEGORY_DATA = [
  {
    name: 'Salad',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Rolls',
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Deserts',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Sandwich',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Cake',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Pure Veg',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Pasta',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Noodles',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80'
  }
];

// 2. DEDICATED, COMPLETELY UNIQUE FOOD IMAGES (No overlap with any Category or Restaurant image)
const FOOD_UNIQUE_IMAGES = {
  // Burgers
  'Truffle Smash Cheeseburger': 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
  'Crispy Nashville Hot Chicken Burger': 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
  'Loaded Truffle & Bacon Fries': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',

  // Pizza
  'Bufala Margherita D.O.P.': 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
  'Diavola Pepperoni & Hot Honey': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
  'Creamy Truffle Wild Mushroom Pasta': 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80',

  // Sushi & Asian
  'Tokyo Black Garlic Tonkotsu Ramen': 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=800&q=80',
  'Rainbow Dragon Maki Roll (8 pcs)': 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80',

  // Biryani
  'Dum Hyderabadi Chicken Biryani': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
  'Royal Paneer Tikka Dum Biryani': 'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80',
  'Royal Subz Dum Biryani': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',

  // Mexican
  'Slow-Cooked Birria Beef Tacos (3 pcs)': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',

  // Desserts
  'Belgian Triple Chocolate Molten Cake': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
  'Classic Venetian Tiramisu Jar': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
  'Warm Belgian Chocolate Waffles': 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
  'Artisan Gelato Sundae Trio': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',

  // Salad
  'Mediterranean Greek Salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80',
  'Farm Fresh Garden Salad': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',

  // Rolls
  'Crispy Veggie Spring Rolls (4 pcs)': 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
  'Smoked Chicken Kathi Roll': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
  'Paneer Tikka Frankie Roll': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  'Fresh Vietnamese Avocado Spring Rolls (3 pcs)': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',

  // Sandwich
  'Smoked Turkey & Avocado Club Sandwich': 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?auto=format&fit=crop&w=800&q=80',
  'Grilled Sourdough Caprese Panini': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  'Smoked BBQ Pulled Chicken Sub': 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=800&q=80',
  'Cheesy Bombay Masala Toast': 'https://images.unsplash.com/photo-1603903631889-b5f3ba4d5b9b?auto=format&fit=crop&w=800&q=80',

  // Cake
  'Red Velvet Supreme Cream Cake': 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80',
  'New York Baked Blueberry Cheesecake': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
  'Dark Chocolate Truffle Fudge Slice': 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80',
  'Lotus Biscoff Caramel Mousse Cake': 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',

  // Pasta
  'Creamy Garlic Alfredo Penne Pasta': 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
  'Classic Baked Lasagna Bolognese': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80',

  // Noodles
  'Spicy Dan Dan Garlic Noodles': 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80',
  'Wok-Tossed Hakka Veg Noodles': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
  'Fiery Schezwan Chicken Noodles': 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80',
  'Authentic Thai Pad Thai Noodles': 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80',

  // Pure Veg / Indian
  'Shahi Paneer Butter Masala': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
  'Amritsari Dal Makhani Bowl': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
};

async function fixAndCleanseDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const Category = require('./models/Category');
    const Food = require('./models/Food');

    // 1. Ensure the canonical category for "Burgers" exists
    let burgersCat = await Category.findOne({ name: 'Burgers' });
    if (!burgersCat) {
      burgersCat = await Category.create({
        name: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80'
      });
    }

    let pizzaCat = await Category.findOne({ name: 'Pizza' });
    if (!pizzaCat) {
      pizzaCat = await Category.create({
        name: 'Pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80'
      });
    }

    let biryaniCat = await Category.findOne({ name: 'Biryani' });
    if (!biryaniCat) {
      biryaniCat = await Category.create({
        name: 'Biryani',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80'
      });
    }

    // 2. Map any foods pointing to singular "Burger" to "Burgers"
    const oldBurgerCat = await Category.findOne({ name: 'Burger' });
    if (oldBurgerCat) {
      const moved = await Food.updateMany(
        { category: oldBurgerCat._id },
        { $set: { category: burgersCat._id } }
      );
      console.log(`Reassigned ${moved.modifiedCount} foods from "Burger" to "Burgers"`);
      await Category.deleteOne({ _id: oldBurgerCat._id });
      console.log('Removed duplicate "Burger" category');
    }

    // 3. Update category images so every single category has a proper image
    for (const catData of CATEGORY_DATA) {
      await Category.findOneAndUpdate(
        { name: catData.name },
        { $set: { image: catData.image } },
        { upsert: true }
      );
    }
    console.log('All categories updated with dedicated images!');

    // 4. Update food items with 100% unique images (no repetition, no overlap with categories)
    for (const [foodName, imageUrl] of Object.entries(FOOD_UNIQUE_IMAGES)) {
      const res = await Food.updateOne(
        { name: foodName },
        { $set: { image: imageUrl } }
      );
      if (res.matchedCount > 0) {
        console.log(`Updated image for food: "${foodName}"`);
      }
    }

    // 5. Verify the updated collections
    const allCategories = await Category.find().sort({ name: 1 });
    console.log('\n=== CURRENT CLEANSED CATEGORIES (' + allCategories.length + ') ===');
    allCategories.forEach(c => {
      console.log(`- ${c.name}: ${c.image}`);
    });

    const allFoods = await Food.find();
    console.log('\n=== CHECKING FOR DUPLICATE IMAGES IN FOODS ===');
    const foodImgMap = {};
    allFoods.forEach(f => {
      foodImgMap[f.image] = (foodImgMap[f.image] || []).concat(f.name);
    });

    let duplicateFound = false;
    Object.entries(foodImgMap).forEach(([img, names]) => {
      if (names.length > 1) {
        duplicateFound = true;
        console.warn('REPEATED FOOD IMAGE:', names, img);
      }
    });

    if (!duplicateFound) {
      console.log('SUCCESS: Every food item in MongoDB now has a 100% unique image!');
    }

    // 6. Check overlap between categories and foods
    const catBases = new Set(allCategories.map(c => c.image.split('?')[0]));
    let overlapFound = false;
    allFoods.forEach(f => {
      const base = f.image.split('?')[0];
      if (catBases.has(base)) {
        overlapFound = true;
        console.warn(`OVERLAP with category image: ${f.name} shares ${base}`);
      }
    });

    if (!overlapFound) {
      console.log('SUCCESS: Category images and food dish images are completely SEPARATED with zero repetition!');
    }

  } catch (err) {
    console.error('Error during cleanse:', err);
  } finally {
    await mongoose.disconnect();
  }
}

fixAndCleanseDatabase();
