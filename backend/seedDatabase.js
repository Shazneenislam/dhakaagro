const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to database - UPDATED: removed deprecated options
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    console.error('Make sure MongoDB is running on localhost:27017');
    process.exit(1);
  }
};

// Sample data
const sampleCategories = [
  {
    name: 'Fruit',
    slug: 'fruit',
    description: 'Fresh and organic fruits',
    icon: './img/Fruit.png',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf',
    subcategories: [
      { name: 'Fresh Fruit', slug: 'fresh-fruit' },
      { name: 'Frozen Fruit', slug: 'frozen-fruit' },
      { name: 'Seasonal Fruit', slug: 'seasonal-fruit' },
      { name: 'Dried Fruit', slug: 'dried-fruit' }
    ],
    isFeatured: true,
    order: 1
  },
  {
    name: 'Vegetable',
    slug: 'vegetable',
    description: 'Fresh and organic vegetables',
    icon: './img/vegetablecard.png',
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7',
    subcategories: [
      { name: 'Fresh Vegetable', slug: 'fresh-vegetable' },
      { name: 'Frozen Vegetable', slug: 'frozen-vegetable' },
      { name: 'Seasonal Vegetable', slug: 'seasonal-vegetable' },
      { name: 'Root Vegetable', slug: 'root-vegetable' }
    ],
    isFeatured: true,
    order: 2
  },
  {
    name: 'Drink & Food',
    slug: 'drink-food',
    description: 'Beverages and ready-to-eat food',
    icon: './img/foodcard.png',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9',
    subcategories: [
      { name: 'All Restaurant', slug: 'all-restaurant' },
      { name: 'Juice and Drinks', slug: 'juice-drinks' },
      { name: 'Breakfast', slug: 'breakfast' },
      { name: 'Fast Food', slug: 'fast-food' }
    ],
    isFeatured: true,
    order: 3
  },
  {
    name: 'Meat',
    slug: 'meat',
    description: 'Fresh meat and poultry',
    icon: './img/meat.png',
    image: 'https://images.unsplash.com/photo-1603048297172-c609bb5e5c7d',
    subcategories: [
      { name: 'Beef & Steak', slug: 'beef-steak' },
      { name: 'Chicken', slug: 'chicken' },
      { name: 'Mutton & Goat', slug: 'mutton-goat' },
      { name: 'Lamb', slug: 'lamb' }
    ],
    isFeatured: true,
    order: 4
  },
  {
    name: 'Fish',
    slug: 'fish',
    description: 'Fresh and frozen seafood',
    icon: './img/fish.png',
    image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6',
    subcategories: [
      { name: 'Dried Fish', slug: 'dried-fish' },
      { name: 'Fish Filling & Steaks', slug: 'fish-filling-steaks' },
      { name: 'Frozen Seafood', slug: 'frozen-seafood' },
      { name: 'Prawn Shrimp', slug: 'prawn-shrimp' }
    ],
    isFeatured: true,
    order: 5
  },
  {
    name: 'Grocery',
    slug: 'grocery',
    description: 'Daily grocery items',
    icon: './img/grocery.png',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
    subcategories: [
      { name: 'Canned & Packed Food', slug: 'canned-packed-food' },
      { name: 'Beauty Products', slug: 'beauty-products' },
      { name: 'Masala & Spices', slug: 'masala-spices' },
      { name: 'Dry Fruits & Nut', slug: 'dry-fruits-nut' }
    ],
    isFeatured: true,
    order: 6
  },
  {
    name: 'Milk & Dairy',
    slug: 'milk-dairy',
    description: 'Fresh dairy products',
    icon: './img/dairy.png',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
    subcategories: [
      { name: 'Cheese', slug: 'cheese' },
      { name: 'Milk & Cream', slug: 'milk-cream' },
      { name: 'Yogurt', slug: 'yogurt' },
      { name: 'Eggs', slug: 'eggs' }
    ],
    isFeatured: true,
    order: 7
  },
  {
    name: 'Frozen Food',
    slug: 'frozen-food',
    description: 'Frozen food items',
    icon: './img/frozenfood.png',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    subcategories: [
      { name: 'Ice Cream & Toppings', slug: 'ice-cream-toppings' },
      { name: 'Frozen Snacks', slug: 'frozen-snacks' },
      { name: 'Frozen Meals', slug: 'frozen-meals' },
      { name: 'Frozen Dairy & Desserts', slug: 'frozen-dairy-desserts' }
    ],
    isFeatured: true,
    order: 8
  }
];

const sampleProducts = [
  // FRESH FRUITS (6 products)
  {
    name: 'Organic Apples 1kg',
    slug: 'organic-apples-1kg',
    description: 'Fresh organic apples, crisp and juicy. Rich in fiber and antioxidants. Perfect for snacks, baking, or making juice.',
    shortDescription: 'Fresh organic apples',
    category: 'Fruit',
    subcategory: 'Fresh Fruit',
    brand: 'Organic Farm',
    price: 4.99,
    originalPrice: 6.99,
    discount: 29,
    stock: 85,
    sku: 'FRUIT-001',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&h=600&fit=crop',
        alt: 'Organic Apples'
      }
    ],
    specifications: [
      { label: 'Weight', value: '1kg' },
      { label: 'Type', value: 'Organic' },
      { label: 'Variety', value: 'Gala Apples' },
      { label: 'Origin', value: 'Local Orchard' },
      { label: 'Shelf Life', value: '2 weeks' }
    ],
    rating: 4.7,
    numReviews: 95,
    sales: 780,
    views: 2100,
    timer: 14400,
    tags: ['apple', 'fruit', 'organic', 'fresh'],
    isFeatured: true
  },
  {
    name: 'Bananas Bunch (6-7 pieces)',
    slug: 'bananas-bunch-6-7-pieces',
    description: 'Fresh ripe bananas, perfect for breakfast, smoothies, or baking. Rich in potassium and natural energy.',
    shortDescription: 'Fresh ripe bananas',
    category: 'Fruit',
    subcategory: 'Fresh Fruit',
    brand: 'Tropical Fresh',
    price: 2.49,
    originalPrice: 3.49,
    discount: 29,
    stock: 120,
    sku: 'FRUIT-002',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop',
        alt: 'Bananas'
      }
    ],
    specifications: [
      { label: 'Quantity', value: '6-7 pieces' },
      { label: 'Type', value: 'Cavendish' },
      { label: 'Ripeness', value: 'Perfectly ripe' },
      { label: 'Origin', value: 'Ecuador' }
    ],
    rating: 4.5,
    numReviews: 120,
    sales: 950,
    views: 2800,
    timer: 7200,
    tags: ['banana', 'fruit', 'fresh', 'tropical'],
    isFeatured: false
  },
  {
    name: 'Fresh Oranges 1kg',
    slug: 'fresh-oranges-1kg',
    description: 'Juicy sweet oranges, packed with Vitamin C. Perfect for juice or as a healthy snack.',
    shortDescription: 'Juicy sweet oranges',
    category: 'Fruit',
    subcategory: 'Fresh Fruit',
    brand: 'Citrus Farm',
    price: 3.99,
    originalPrice: 5.49,
    discount: 27,
    stock: 95,
    sku: 'FRUIT-003',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&h=600&fit=crop',
        alt: 'Oranges'
      }
    ],
    specifications: [
      { label: 'Weight', value: '1kg' },
      { label: 'Type', value: 'Navel Oranges' },
      { label: 'Origin', value: 'California' },
      { label: 'Season', value: 'Winter' }
    ],
    rating: 4.6,
    numReviews: 85,
    sales: 620,
    views: 1900,
    tags: ['orange', 'citrus', 'vitamin-c', 'fruit'],
    isFeatured: false
  },
  {
    name: 'Seasonal Mangoes 1kg',
    slug: 'seasonal-mangoes-1kg',
    description: 'Sweet and juicy seasonal mangoes, perfect for desserts, smoothies, or eating fresh.',
    shortDescription: 'Sweet seasonal mangoes',
    category: 'Fruit',
    subcategory: 'Seasonal Fruit',
    brand: 'Tropical Delight',
    price: 5.99,
    originalPrice: 8.99,
    discount: 33,
    stock: 45,
    sku: 'FRUIT-004',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&h=600&fit=crop',
        alt: 'Mangoes'
      }
    ],
    specifications: [
      { label: 'Weight', value: '1kg' },
      { label: 'Type', value: 'Alphonso' },
      { label: 'Season', value: 'Summer' },
      { label: 'Origin', value: 'India' }
    ],
    rating: 4.8,
    numReviews: 65,
    sales: 320,
    views: 1100,
    timer: 21600,
    tags: ['mango', 'tropical', 'seasonal', 'fruit'],
    isFeatured: true
  },
  {
    name: 'Mixed Berries Frozen 500g',
    slug: 'mixed-berries-frozen-500g',
    description: 'Frozen mixed berries including strawberries, blueberries, and raspberries. Perfect for smoothies and baking.',
    shortDescription: 'Frozen mixed berries',
    category: 'Fruit',
    subcategory: 'Frozen Fruit',
    brand: 'Arctic Farm',
    price: 6.99,
    originalPrice: 9.99,
    discount: 30,
    stock: 75,
    sku: 'FRUIT-005',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600&h=600&fit=crop',
        alt: 'Mixed Berries'
      }
    ],
    specifications: [
      { label: 'Weight', value: '500g' },
      { label: 'Type', value: 'Mixed Berries' },
      { label: 'Storage', value: 'Keep frozen' },
      { label: 'Contents', value: 'Strawberry, Blueberry, Raspberry' }
    ],
    rating: 4.4,
    numReviews: 110,
    sales: 480,
    views: 1500,
    tags: ['berries', 'frozen', 'fruit', 'smoothie'],
    isFeatured: false
  },
  {
    name: 'Premium Dried Apricots 250g',
    slug: 'premium-dried-apricots-250g',
    description: 'Sun-dried apricots, naturally sweet with no added sugar. Perfect healthy snack.',
    shortDescription: 'Natural dried apricots',
    category: 'Fruit',
    subcategory: 'Dried Fruit',
    brand: 'Sunshine Dry',
    price: 7.49,
    originalPrice: 10.99,
    discount: 32,
    stock: 60,
    sku: 'FRUIT-006',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=600&h=600&fit=crop',
        alt: 'Dried Apricots'
      }
    ],
    specifications: [
      { label: 'Weight', value: '250g' },
      { label: 'Type', value: 'Dried Fruit' },
      { label: 'Sugar', value: 'No added sugar' },
      { label: 'Preservatives', value: 'None' }
    ],
    rating: 4.6,
    numReviews: 90,
    sales: 390,
    views: 1300,
    timer: 28800,
    tags: ['apricot', 'dried-fruit', 'snack', 'healthy'],
    isFeatured: false
  },

  // VEGETABLES (6 products)
  {
    name: 'Big Potatoes 1 Kg',
    slug: 'big-potatoes-1-kg',
    description: 'Fresh, organic potatoes perfect for boiling, baking, frying, and mashing. Rich in vitamins and minerals, sourced directly from local farms.',
    shortDescription: 'Fresh organic potatoes',
    category: 'Vegetable',
    subcategory: 'Root Vegetable',
    brand: 'Organic Farm',
    price: 10.99,
    originalPrice: 35.60,
    discount: 69,
    stock: 150,
    sku: 'VEG-001',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop',
        alt: 'Potatoes'
      }
    ],
    specifications: [
      { label: 'Weight', value: '1 Kg' },
      { label: 'Type', value: 'Organic' },
      { label: 'Variety', value: 'Russet Potatoes' },
      { label: 'Storage', value: 'Cool dry place' },
      { label: 'Origin', value: 'Local Farm' }
    ],
    rating: 4.8,
    numReviews: 120,
    sales: 890,
    views: 2500,
    timer: 7200,
    tags: ['vegetable', 'organic', 'potato', 'root'],
    isFeatured: true
  },
  {
    name: 'Fresh Tomatoes 500g',
    slug: 'fresh-tomatoes-500g',
    description: 'Fresh vine-ripened tomatoes, perfect for salads, sandwiches, and cooking.',
    shortDescription: 'Fresh vine tomatoes',
    category: 'Vegetable',
    subcategory: 'Fresh Vegetable',
    brand: 'Garden Fresh',
    price: 2.99,
    originalPrice: 4.49,
    discount: 33,
    stock: 200,
    sku: 'VEG-002',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=600&fit=crop',
        alt: 'Fresh Tomatoes'
      }
    ],
    specifications: [
      { label: 'Weight', value: '500g' },
      { label: 'Type', value: 'Vine Tomatoes' },
      { label: 'Origin', value: 'Local Farm' },
      { label: 'Usage', value: 'Salads, Cooking' }
    ],
    rating: 4.5,
    numReviews: 95,
    sales: 720,
    views: 2100,
    tags: ['tomato', 'vegetable', 'fresh', 'salad'],
    isFeatured: false
  },
  {
    name: 'Organic Carrots 500g',
    slug: 'organic-carrots-500g',
    description: 'Sweet and crunchy organic carrots, perfect for snacks, juicing, or cooking.',
    shortDescription: 'Organic crunchy carrots',
    category: 'Vegetable',
    subcategory: 'Root Vegetable',
    brand: 'Organic Farm',
    price: 3.49,
    originalPrice: 4.99,
    discount: 30,
    stock: 180,
    sku: 'VEG-003',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1598170845058-78131a90f4bf?w=600&h=600&fit=crop',
        alt: 'Carrots'
      }
    ],
    specifications: [
      { label: 'Weight', value: '500g' },
      { label: 'Type', value: 'Organic' },
      { label: 'Variety', value: 'Nantes Carrots' },
      { label: 'Origin', value: 'Local Farm' }
    ],
    rating: 4.7,
    numReviews: 110,
    sales: 680,
    views: 1950,
    timer: 10800,
    tags: ['carrot', 'vegetable', 'organic', 'root'],
    isFeatured: false
  },
  {
    name: 'Frozen Mixed Vegetables 1kg',
    slug: 'frozen-mixed-vegetables-1kg',
    description: 'Frozen mixed vegetables including peas, corn, carrots, and green beans. Perfect for stir-fries and soups.',
    shortDescription: 'Frozen mixed vegetables',
    category: 'Vegetable',
    subcategory: 'Frozen Vegetable',
    brand: 'Arctic Farm',
    price: 4.99,
    originalPrice: 6.99,
    discount: 29,
    stock: 90,
    sku: 'VEG-004',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop',
        alt: 'Mixed Vegetables'
      }
    ],
    specifications: [
      { label: 'Weight', value: '1kg' },
      { label: 'Type', value: 'Frozen' },
      { label: 'Contents', value: 'Peas, Corn, Carrots, Green Beans' },
      { label: 'Storage', value: 'Keep frozen' }
    ],
    rating: 4.4,
    numReviews: 85,
    sales: 420,
    views: 1250,
    tags: ['vegetable', 'frozen', 'mixed', 'peas'],
    isFeatured: false
  },
  {
    name: 'Seasonal Pumpkin 1kg',
    slug: 'seasonal-pumpkin-1kg',
    description: 'Fresh seasonal pumpkin, perfect for soups, roasting, or making pies.',
    shortDescription: 'Fresh seasonal pumpkin',
    category: 'Vegetable',
    subcategory: 'Seasonal Vegetable',
    brand: 'Harvest Time',
    price: 3.99,
    originalPrice: 5.99,
    discount: 33,
    stock: 65,
    sku: 'VEG-005',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=600&fit=crop',
        alt: 'Pumpkin'
      }
    ],
    specifications: [
      { label: 'Weight', value: '1kg' },
      { label: 'Type', value: 'Butternut Pumpkin' },
      { label: 'Season', value: 'Autumn' },
      { label: 'Best For', value: 'Soup, Roasting' }
    ],
    rating: 4.6,
    numReviews: 70,
    sales: 310,
    views: 950,
    timer: 14400,
    tags: ['pumpkin', 'vegetable', 'seasonal', 'autumn'],
    isFeatured: false
  },
  {
    name: 'Fresh Bell Peppers 3 Pack',
    slug: 'fresh-bell-peppers-3-pack',
    description: 'Colorful bell peppers including red, yellow, and green. Perfect for salads, stir-fries, and stuffing.',
    shortDescription: 'Colorful bell peppers',
    category: 'Vegetable',
    subcategory: 'Fresh Vegetable',
    brand: 'Colorful Harvest',
    price: 4.49,
    originalPrice: 6.49,
    discount: 31,
    stock: 110,
    sku: 'VEG-006',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1566385101042-1a0f0c126c96?w=600&h=600&fit=crop',
        alt: 'Bell Peppers'
      }
    ],
    specifications: [
      { label: 'Quantity', value: '3 pieces' },
      { label: 'Colors', value: 'Red, Yellow, Green' },
      { label: 'Type', value: 'Bell Peppers' },
      { label: 'Origin', value: 'Local Farm' }
    ],
    rating: 4.5,
    numReviews: 80,
    sales: 450,
    views: 1350,
    tags: ['pepper', 'vegetable', 'colorful', 'fresh'],
    isFeatured: false
  },

  // DRINK & FOOD (6 products)
  {
    name: 'Fresh Orange Juice 1L',
    slug: 'fresh-orange-juice-1l',
    description: '100% pure freshly squeezed orange juice with no added sugar or preservatives.',
    shortDescription: 'Fresh orange juice',
    category: 'Drink & Food',
    subcategory: 'Juice and Drinks',
    brand: 'Juicy Fresh',
    price: 5.99,
    originalPrice: 7.99,
    discount: 25,
    stock: 75,
    sku: 'DRINK-001',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&h=600&fit=crop',
        alt: 'Orange Juice'
      }
    ],
    specifications: [
      { label: 'Volume', value: '1 Liter' },
      { label: 'Type', value: '100% Pure Juice' },
      { label: 'Sugar', value: 'No added sugar' },
      { label: 'Preservatives', value: 'None' }
    ],
    rating: 4.7,
    numReviews: 120,
    sales: 580,
    views: 1800,
    timer: 21600,
    tags: ['juice', 'orange', 'drink', 'beverage'],
    isFeatured: true
  },
  {
    name: 'Breakfast Cereal 500g',
    slug: 'breakfast-cereal-500g',
    description: 'Whole grain breakfast cereal with nuts and dried fruits. Perfect healthy breakfast option.',
    shortDescription: 'Whole grain breakfast cereal',
    category: 'Drink & Food',
    subcategory: 'Breakfast',
    brand: 'Morning Fuel',
    price: 6.49,
    originalPrice: 8.99,
    discount: 28,
    stock: 95,
    sku: 'FOOD-001',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=600&fit=crop',
        alt: 'Breakfast Cereal'
      }
    ],
    specifications: [
      { label: 'Weight', value: '500g' },
      { label: 'Type', value: 'Whole Grain Cereal' },
      { label: 'Contents', value: 'Oats, Nuts, Dried Fruits' },
      { label: 'Sugar', value: 'Low sugar' }
    ],
    rating: 4.4,
    numReviews: 95,
    sales: 520,
    views: 1650,
    tags: ['cereal', 'breakfast', 'healthy', 'grain'],
    isFeatured: false
  },
  {
    name: 'Premium Coffee Beans 250g',
    slug: 'premium-coffee-beans-250g',
    description: 'Arabica coffee beans, medium roast. Perfect for making rich and aromatic coffee.',
    shortDescription: 'Premium Arabica coffee beans',
    category: 'Drink & Food',
    subcategory: 'Juice and Drinks',
    brand: 'Brew Masters',
    price: 12.99,
    originalPrice: 16.99,
    discount: 24,
    stock: 60,
    sku: 'DRINK-002',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600&h=600&fit=crop',
        alt: 'Coffee Beans'
      }
    ],
    specifications: [
      { label: 'Weight', value: '250g' },
      { label: 'Type', value: 'Arabica Beans' },
      { label: 'Roast', value: 'Medium' },
      { label: 'Origin', value: 'Colombia' }
    ],
    rating: 4.8,
    numReviews: 150,
    sales: 420,
    views: 1450,
    timer: 43200,
    tags: ['coffee', 'beans', 'arabica', 'drink'],
    isFeatured: true
  },
  {
    name: 'Frozen Pizza 400g',
    slug: 'frozen-pizza-400g',
    description: 'Delicious frozen pizza with pepperoni and cheese. Ready to bake in minutes.',
    shortDescription: 'Pepperoni pizza',
    category: 'Drink & Food',
    subcategory: 'Fast Food',
    brand: 'Pizza Express',
    price: 6.99,
    originalPrice: 9.99,
    discount: 30,
    stock: 85,
    sku: 'FOOD-002',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop',
        alt: 'Pizza'
      }
    ],
    specifications: [
      { label: 'Weight', value: '400g' },
      { label: 'Type', value: 'Pepperoni Pizza' },
      { label: 'Storage', value: 'Keep frozen' },
      { label: 'Cooking Time', value: '15-20 minutes' }
    ],
    rating: 4.3,
    numReviews: 110,
    sales: 680,
    views: 2100,
    tags: ['pizza', 'fast-food', 'frozen', 'pepperoni'],
    isFeatured: false
  },
  {
    name: 'Green Tea 100g',
    slug: 'green-tea-100g',
    description: 'Premium green tea leaves, rich in antioxidants. Perfect for a healthy beverage.',
    shortDescription: 'Premium green tea leaves',
    category: 'Drink & Food',
    subcategory: 'Juice and Drinks',
    brand: 'Zen Tea',
    price: 8.99,
    originalPrice: 12.99,
    discount: 31,
    stock: 70,
    sku: 'DRINK-003',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop',
        alt: 'Green Tea'
      }
    ],
    specifications: [
      { label: 'Weight', value: '100g' },
      { label: 'Type', value: 'Green Tea Leaves' },
      { label: 'Origin', value: 'Japan' },
      { label: 'Antioxidants', value: 'High' }
    ],
    rating: 4.6,
    numReviews: 85,
    sales: 390,
    views: 1250,
    tags: ['tea', 'green-tea', 'healthy', 'beverage'],
    isFeatured: false
  },
  {
    name: 'Energy Bars 5 Pack',
    slug: 'energy-bars-5-pack',
    description: 'Healthy energy bars with nuts and dried fruits. Perfect for on-the-go snacking.',
    shortDescription: 'Healthy energy bars',
    category: 'Drink & Food',
    subcategory: 'Breakfast',
    brand: 'Energy Boost',
    price: 7.49,
    originalPrice: 10.99,
    discount: 32,
    stock: 120,
    sku: 'FOOD-003',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop',
        alt: 'Energy Bars'
      }
    ],
    specifications: [
      { label: 'Quantity', value: '5 bars' },
      { label: 'Type', value: 'Energy Bar' },
      { label: 'Flavor', value: 'Mixed Nuts & Fruits' },
      { label: 'Protein', value: '10g per bar' }
    ],
    rating: 4.5,
    numReviews: 95,
    sales: 520,
    views: 1750,
    timer: 14400,
    tags: ['energy-bar', 'snack', 'healthy', 'breakfast'],
    isFeatured: false
  },

  // MEAT (6 products)
  {
    name: 'HALAL TURKEY (AROUND 12-13 LB)',
    slug: 'halal-turkey-around-12-13-lb',
    description: 'Premium halal turkey, carefully sourced and processed following strict halal guidelines. Perfect for family gatherings, special occasions, and festive meals.',
    shortDescription: 'Premium halal turkey for special occasions',
    category: 'Meat',
    subcategory: 'Chicken',
    brand: 'Premium Halal',
    price: 28.07,
    originalPrice: 35.60,
    discount: 21,
    stock: 25,
    sku: 'MEAT-001',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1587590227264-0ac64ce63ce8?w=600&h=600&fit=crop',
        alt: 'Halal Turkey'
      }
    ],
    specifications: [
      { label: 'Weight', value: '12-13 LB' },
      { label: 'Type', value: 'Halal Certified' },
      { label: 'Storage', value: 'Keep frozen at -18°C' },
      { label: 'Shelf Life', value: '12 months frozen' },
      { label: 'Origin', value: 'Locally sourced' }
    ],
    rating: 4.5,
    numReviews: 65,
    sales: 450,
    views: 1200,
    timer: 86400,
    tags: ['halal', 'meat', 'turkey', 'frozen'],
    isFeatured: true
  },
  {
    name: 'Fresh Chicken Breast 500g',
    slug: 'fresh-chicken-breast-500g',
    description: 'Boneless, skinless chicken breast. Perfect for grilling, baking, or stir-frying. High in protein and low in fat.',
    shortDescription: 'Boneless skinless chicken breast',
    category: 'Meat',
    subcategory: 'Chicken',
    brand: 'Farm Fresh',
    price: 8.99,
    originalPrice: 12.99,
    discount: 31,
    stock: 18,
    sku: 'MEAT-002',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1589987607627-8cfae2d0ebd4?w=600&h=600&fit=crop',
        alt: 'Chicken Breast'
      }
    ],
    specifications: [
      { label: 'Weight', value: '500g' },
      { label: 'Type', value: 'Boneless, Skinless' },
      { label: 'Storage', value: 'Keep refrigerated' },
      { label: 'Best Before', value: '3 days' },
      { label: 'Origin', value: 'Free-range farm' }
    ],
    rating: 4.3,
    numReviews: 75,
    sales: 670,
    views: 1800,
    timer: 3600,
    tags: ['chicken', 'meat', 'protein', 'fresh'],
    isFeatured: true
  },
  {
    name: 'Premium Beef Steak 300g',
    slug: 'premium-beef-steak-300g',
    description: 'Prime cut beef steak, aged to perfection. Perfect for grilling or pan-frying.',
    shortDescription: 'Premium beef steak',
    category: 'Meat',
    subcategory: 'Beef & Steak',
    brand: 'Prime Cuts',
    price: 15.99,
    originalPrice: 22.99,
    discount: 30,
    stock: 35,
    sku: 'MEAT-003',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=600&fit=crop',
        alt: 'Beef Steak'
      }
    ],
    specifications: [
      { label: 'Weight', value: '300g' },
      { label: 'Type', value: 'Ribeye Steak' },
      { label: 'Grade', value: 'Prime' },
      { label: 'Aging', value: '21 days' }
    ],
    rating: 4.7,
    numReviews: 90,
    sales: 320,
    views: 1100,
    timer: 28800,
    tags: ['beef', 'steak', 'meat', 'premium'],
    isFeatured: true
  },
  {
    name: 'Fresh Mutton Leg 1kg',
    slug: 'fresh-mutton-leg-1kg',
    description: 'Fresh mutton leg, perfect for curries, roasts, or slow cooking.',
    shortDescription: 'Fresh mutton leg',
    category: 'Meat',
    subcategory: 'Mutton & Goat',
    brand: 'Halal Meat Co',
    price: 18.99,
    originalPrice: 25.99,
    discount: 27,
    stock: 28,
    sku: 'MEAT-004',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1603048297172-c609bb5e5c7d?w=600&h=600&fit=crop',
        alt: 'Mutton Leg'
      }
    ],
    specifications: [
      { label: 'Weight', value: '1kg' },
      { label: 'Type', value: 'Mutton Leg' },
      { label: 'Certification', value: 'Halal' },
      { label: 'Storage', value: 'Keep refrigerated' }
    ],
    rating: 4.4,
    numReviews: 65,
    sales: 240,
    views: 850,
    tags: ['mutton', 'goat', 'meat', 'halal'],
    isFeatured: false
  },
  {
    name: 'Ground Beef 500g',
    slug: 'ground-beef-500g',
    description: 'Fresh ground beef, perfect for burgers, meatballs, or pasta sauces.',
    shortDescription: 'Fresh ground beef',
    category: 'Meat',
    subcategory: 'Beef & Steak',
    brand: 'Farm Fresh',
    price: 7.99,
    originalPrice: 10.99,
    discount: 27,
    stock: 50,
    sku: 'MEAT-005',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1603048297172-c609bb5e5c7d?w=600&h=600&fit=crop',
        alt: 'Ground Beef'
      }
    ],
    specifications: [
      { label: 'Weight', value: '500g' },
      { label: 'Type', value: 'Ground Beef' },
      { label: 'Fat Content', value: '15%' },
      { label: 'Best For', value: 'Burgers, Meatballs' }
    ],
    rating: 4.5,
    numReviews: 85,
    sales: 420,
    views: 1350,
    timer: 7200,
    tags: ['beef', 'ground-beef', 'meat', 'burger'],
    isFeatured: false
  },
  {
    name: 'Lamb Chops 400g',
    slug: 'lamb-chops-400g',
    description: 'Fresh lamb chops, perfect for grilling or pan-frying.',
    shortDescription: 'Fresh lamb chops',
    category: 'Meat',
    subcategory: 'Lamb',
    brand: 'Prime Cuts',
    price: 14.99,
    originalPrice: 19.99,
    discount: 25,
    stock: 32,
    sku: 'MEAT-006',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=600&fit=crop',
        alt: 'Lamb Chops'
      }
    ],
    specifications: [
      { label: 'Weight', value: '400g' },
      { label: 'Type', value: 'Lamb Chops' },
      { label: 'Cut', value: 'Rib Chops' },
      { label: 'Storage', value: 'Keep refrigerated' }
    ],
    rating: 4.6,
    numReviews: 70,
    sales: 280,
    views: 950,
    tags: ['lamb', 'chops', 'meat', 'premium'],
    isFeatured: false
  },

  // FISH (6 products)
  {
    name: 'Frozen Shrimp 500g',
    slug: 'frozen-shrimp-500g',
    description: 'Premium frozen shrimp, ready to cook. Perfect for stir-fries, curries, and grilling.',
    shortDescription: 'Premium frozen shrimp',
    category: 'Fish',
    subcategory: 'Prawn Shrimp',
    brand: 'Ocean Fresh',
    price: 12.99,
    originalPrice: 16.99,
    discount: 24,
    stock: 32,
    sku: 'FISH-001',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=600&h=600&fit=crop',
        alt: 'Frozen Shrimp'
      }
    ],
    specifications: [
      { label: 'Weight', value: '500g' },
      { label: 'Type', value: 'Peeled & Deveined' },
      { label: 'Size', value: 'Medium (31-40 count)' },
      { label: 'Storage', value: 'Keep frozen' }
    ],
    rating: 4.5,
    numReviews: 85,
    sales: 420,
    views: 1300,
    timer: 57600,
    tags: ['shrimp', 'seafood', 'frozen', 'prawn'],
    isFeatured: true
  },
  {
    name: 'Fresh Salmon Fillet 300g',
    slug: 'fresh-salmon-fillet-300g',
    description: 'Fresh salmon fillet, rich in Omega-3. Perfect for grilling, baking, or pan-frying.',
    shortDescription: 'Fresh salmon fillet',
    category: 'Fish',
    subcategory: 'Fish Filling & Steaks',
    brand: 'Ocean Fresh',
    price: 11.99,
    originalPrice: 15.99,
    discount: 25,
    stock: 45,
    sku: 'FISH-002',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=600&h=600&fit=crop',
        alt: 'Salmon Fillet'
      }
    ],
    specifications: [
      { label: 'Weight', value: '300g' },
      { label: 'Type', value: 'Atlantic Salmon' },
      { label: 'Cut', value: 'Skinless Fillet' },
      { label: 'Omega-3', value: 'High' }
    ],
    rating: 4.7,
    numReviews: 120,
    sales: 380,
    views: 1250,
    timer: 14400,
    tags: ['salmon', 'fish', 'seafood', 'omega-3'],
    isFeatured: true
  },
  {
    name: 'Dried Cod Fish 250g',
    slug: 'dried-cod-fish-250g',
    description: 'Traditional dried cod fish, perfect for stews, soups, and traditional dishes.',
    shortDescription: 'Dried cod fish',
    category: 'Fish',
    subcategory: 'Dried Fish',
    brand: 'Traditional Catch',
    price: 9.99,
    originalPrice: 13.99,
    discount: 29,
    stock: 55,
    sku: 'FISH-003',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=600&h=600&fit=crop',
        alt: 'Dried Cod Fish'
      }
    ],
    specifications: [
      { label: 'Weight', value: '250g' },
      { label: 'Type', value: 'Dried Cod' },
      { label: 'Preparation', value: 'Soak before cooking' },
      { label: 'Storage', value: 'Cool dry place' }
    ],
    rating: 4.4,
    numReviews: 65,
    sales: 210,
    views: 750,
    tags: ['cod', 'dried-fish', 'seafood', 'traditional'],
    isFeatured: false
  },
  {
    name: 'Frozen Fish Fillets 500g',
    slug: 'frozen-fish-fillets-500g',
    description: 'Frozen white fish fillets, boneless and ready to cook. Perfect for frying or baking.',
    shortDescription: 'Frozen fish fillets',
    category: 'Fish',
    subcategory: 'Frozen Seafood',
    brand: 'Arctic Catch',
    price: 8.99,
    originalPrice: 11.99,
    discount: 25,
    stock: 70,
    sku: 'FISH-004',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=600&fit=crop',
        alt: 'Fish Fillets'
      }
    ],
    specifications: [
      { label: 'Weight', value: '500g' },
      { label: 'Type', value: 'White Fish Fillets' },
      { label: 'Boneless', value: 'Yes' },
      { label: 'Storage', value: 'Keep frozen' }
    ],
    rating: 4.3,
    numReviews: 90,
    sales: 350,
    views: 1150,
    tags: ['fish', 'frozen', 'fillets', 'seafood'],
    isFeatured: false
  },
  {
    name: 'Fresh Tuna Steak 250g',
    slug: 'fresh-tuna-steak-250g',
    description: 'Fresh tuna steak, perfect for grilling or searing. Rich in protein and healthy fats.',
    shortDescription: 'Fresh tuna steak',
    category: 'Fish',
    subcategory: 'Fish Filling & Steaks',
    brand: 'Ocean Fresh',
    price: 13.99,
    originalPrice: 18.99,
    discount: 26,
    stock: 38,
    sku: 'FISH-005',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop',
        alt: 'Tuna Steak'
      }
    ],
    specifications: [
      { label: 'Weight', value: '250g' },
      { label: 'Type', value: 'Yellowfin Tuna' },
      { label: 'Cut', value: 'Steak' },
      { label: 'Protein', value: 'High' }
    ],
    rating: 4.6,
    numReviews: 75,
    sales: 290,
    views: 980,
    timer: 21600,
    tags: ['tuna', 'steak', 'fish', 'seafood'],
    isFeatured: false
  },
  {
    name: 'Mixed Seafood Pack 1kg',
    slug: 'mixed-seafood-pack-1kg',
    description: 'Frozen mixed seafood including shrimp, squid, and mussels. Perfect for paella or seafood stew.',
    shortDescription: 'Mixed frozen seafood',
    category: 'Fish',
    subcategory: 'Frozen Seafood',
    brand: 'Ocean Mix',
    price: 15.99,
    originalPrice: 21.99,
    discount: 27,
    stock: 42,
    sku: 'FISH-006',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&h=600&fit=crop',
        alt: 'Mixed Seafood'
      }
    ],
    specifications: [
      { label: 'Weight', value: '1kg' },
      { label: 'Contents', value: 'Shrimp, Squid, Mussels' },
      { label: 'Storage', value: 'Keep frozen' },
      { label: 'Preparation', value: 'Ready to cook' }
    ],
    rating: 4.5,
    numReviews: 85,
    sales: 320,
    views: 1100,
    tags: ['seafood', 'mixed', 'frozen', 'shrimp'],
    isFeatured: false
  },

  // GROCERY (6 products)
  {
    name: 'OLIO VILLA BLENDED PROMACE OIL 3.785L',
    slug: 'olio-villa-blended-promace-oil-3-785l',
    description: 'Premium blended promace oil suitable for all types of cooking including frying, sautéing, and baking. Low cholesterol and rich in nutrients.',
    shortDescription: 'Premium blended cooking oil',
    category: 'Grocery',
    subcategory: 'Canned & Packed Food',
    brand: 'Olio Villa',
    price: 13.99,
    originalPrice: 25.60,
    discount: 45,
    stock: 42,
    sku: 'GROC-001',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=600&h=600&fit=crop',
        alt: 'Cooking Oil'
      }
    ],
    specifications: [
      { label: 'Volume', value: '3.785L (1 Gallon)' },
      { label: 'Type', value: 'Blended Cooking Oil' },
      { label: 'Shelf Life', value: '24 months' },
      { label: 'Smoke Point', value: '220°C' },
      { label: 'Best For', value: 'Frying & Cooking' }
    ],
    rating: 4.2,
    numReviews: 89,
    sales: 320,
    views: 950,
    timer: 43200,
    tags: ['oil', 'cooking', 'grocery', 'packed'],
    isFeatured: true
  },
  {
    name: 'Premium Basmati Rice 5kg',
    slug: 'premium-basmati-rice-5kg',
    description: 'Long grain basmati rice with aromatic fragrance. Perfect for biryanis, pilafs, and everyday meals.',
    shortDescription: 'Long grain aromatic basmati rice',
    category: 'Grocery',
    subcategory: 'Canned & Packed Food',
    brand: 'Royal Harvest',
    price: 15.99,
    originalPrice: 19.99,
    discount: 20,
    stock: 65,
    sku: 'GROC-002',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
        alt: 'Basmati Rice'
      }
    ],
    specifications: [
      { label: 'Weight', value: '5kg' },
      { label: 'Type', value: 'Basmati Rice' },
      { label: 'Grain', value: 'Long Grain' },
      { label: 'Origin', value: 'India' }
    ],
    rating: 4.6,
    numReviews: 210,
    sales: 1200,
    views: 3500,
    timer: 172800,
    tags: ['rice', 'basmati', 'grain', 'grocery'],
    isFeatured: true
  },
  {
    name: 'Extra Virgin Olive Oil 1L',
    slug: 'extra-virgin-olive-oil-1l',
    description: 'Cold-pressed extra virgin olive oil, rich in antioxidants. Perfect for salads, dressings, and light cooking.',
    shortDescription: 'Cold-pressed extra virgin olive oil',
    category: 'Grocery',
    subcategory: 'Canned & Packed Food',
    brand: 'Mediterranean Gold',
    price: 18.99,
    originalPrice: 24.99,
    discount: 24,
    stock: 40,
    sku: 'GROC-003',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop',
        alt: 'Olive Oil'
      }
    ],
    specifications: [
      { label: 'Volume', value: '1 Liter' },
      { label: 'Type', value: 'Extra Virgin' },
      { label: 'Processing', value: 'Cold-pressed' },
      { label: 'Origin', value: 'Italy' },
      { label: 'Best For', value: 'Salads & Dressings' }
    ],
    rating: 4.7,
    numReviews: 95,
    sales: 380,
    views: 1400,
    tags: ['olive-oil', 'healthy', 'cooking', 'grocery'],
    isFeatured: true
  },
  {
    name: 'Assorted Spices Set',
    slug: 'assorted-spices-set',
    description: 'Set of essential spices including turmeric, cumin, coriander, and chili powder.',
    shortDescription: 'Essential spices set',
    category: 'Grocery',
    subcategory: 'Masala & Spices',
    brand: 'Spice Master',
    price: 12.99,
    originalPrice: 17.99,
    discount: 28,
    stock: 85,
    sku: 'GROC-004',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1534938665420-4193effeacc4?w=600&h=600&fit=crop',
        alt: 'Spices'
      }
    ],
    specifications: [
      { label: 'Contents', value: '6 spice jars' },
      { label: 'Spices', value: 'Turmeric, Cumin, Coriander, Chili, etc.' },
      { label: 'Weight', value: '50g each' },
      { label: 'Origin', value: 'India' }
    ],
    rating: 4.5,
    numReviews: 110,
    sales: 450,
    views: 1450,
    timer: 43200,
    tags: ['spices', 'masala', 'cooking', 'grocery'],
    isFeatured: false
  },
  {
    name: 'Mixed Dry Fruits 500g',
    slug: 'mixed-dry-fruits-500g',
    description: 'Premium mixed dry fruits including almonds, cashews, walnuts, and raisins.',
    shortDescription: 'Premium mixed dry fruits',
    category: 'Grocery',
    subcategory: 'Dry Fruits & Nut',
    brand: 'Nutty Delight',
    price: 14.99,
    originalPrice: 19.99,
    discount: 25,
    stock: 95,
    sku: 'GROC-005',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1540914124281-342587941389?w=600&h=600&fit=crop',
        alt: 'Dry Fruits'
      }
    ],
    specifications: [
      { label: 'Weight', value: '500g' },
      { label: 'Contents', value: 'Almonds, Cashews, Walnuts, Raisins' },
      { label: 'Type', value: 'Mixed Dry Fruits' },
      { label: 'Storage', value: 'Cool dry place' }
    ],
    rating: 4.7,
    numReviews: 130,
    sales: 520,
    views: 1750,
    tags: ['dry-fruits', 'nuts', 'healthy', 'grocery'],
    isFeatured: true
  },
  {
    name: 'Natural Face Cream 100ml',
    slug: 'natural-face-cream-100ml',
    description: 'Natural face cream with aloe vera and vitamin E. Suitable for all skin types.',
    shortDescription: 'Natural face cream',
    category: 'Grocery',
    subcategory: 'Beauty Products',
    brand: 'Natural Glow',
    price: 9.99,
    originalPrice: 14.99,
    discount: 33,
    stock: 120,
    sku: 'GROC-006',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=600&h=600&fit=crop',
        alt: 'Face Cream'
      }
    ],
    specifications: [
      { label: 'Volume', value: '100ml' },
      { label: 'Type', value: 'Face Cream' },
      { label: 'Ingredients', value: 'Aloe Vera, Vitamin E' },
      { label: 'Skin Type', value: 'All types' }
    ],
    rating: 4.4,
    numReviews: 95,
    sales: 380,
    views: 1250,
    tags: ['beauty', 'cream', 'skin-care', 'grocery'],
    isFeatured: false
  },

  // MILK & DAIRY (6 products)
  {
    name: 'Fresh Milk 1L',
    slug: 'fresh-milk-1l',
    description: 'Fresh pasteurized milk, rich in calcium and vitamins. Perfect for drinking, cooking, and baking.',
    shortDescription: 'Fresh pasteurized full cream milk',
    category: 'Milk & Dairy',
    subcategory: 'Milk & Cream',
    brand: 'Pure Dairy',
    price: 2.99,
    originalPrice: 3.49,
    discount: 14,
    stock: 100,
    sku: 'DAIRY-001',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=600&fit=crop',
        alt: 'Fresh Milk'
      }
    ],
    specifications: [
      { label: 'Volume', value: '1 Liter' },
      { label: 'Type', value: 'Full Cream' },
      { label: 'Storage', value: 'Keep refrigerated' },
      { label: 'Best Before', value: '7 days' }
    ],
    rating: 4.4,
    numReviews: 150,
    sales: 2300,
    views: 4200,
    timer: 28800,
    tags: ['milk', 'dairy', 'fresh', 'cream'],
    isFeatured: true
  },
  {
    name: 'Greek Yogurt 500g',
    slug: 'greek-yogurt-500g',
    description: 'Creamy Greek yogurt, high in protein and probiotics. Perfect for breakfast, smoothies, or as a healthy snack.',
    shortDescription: 'Creamy high-protein Greek yogurt',
    category: 'Milk & Dairy',
    subcategory: 'Yogurt',
    brand: 'Pure Dairy',
    price: 3.99,
    originalPrice: 4.99,
    discount: 20,
    stock: 60,
    sku: 'DAIRY-002',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&h=600&fit=crop',
        alt: 'Greek Yogurt'
      }
    ],
    specifications: [
      { label: 'Weight', value: '500g' },
      { label: 'Type', value: 'Greek Yogurt' },
      { label: 'Flavor', value: 'Natural' },
      { label: 'Storage', value: 'Keep refrigerated' },
      { label: 'Best Before', value: '14 days' }
    ],
    rating: 4.6,
    numReviews: 110,
    sales: 550,
    views: 1600,
    tags: ['yogurt', 'dairy', 'protein', 'greek'],
    isFeatured: false
  },
  {
    name: 'Cheddar Cheese 200g',
    slug: 'cheddar-cheese-200g',
    description: 'Aged cheddar cheese, sharp and flavorful. Perfect for sandwiches, burgers, or snacks.',
    shortDescription: 'Aged cheddar cheese',
    category: 'Milk & Dairy',
    subcategory: 'Cheese',
    brand: 'Cheese Masters',
    price: 5.99,
    originalPrice: 7.99,
    discount: 25,
    stock: 85,
    sku: 'DAIRY-003',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&h=600&fit=crop',
        alt: 'Cheddar Cheese'
      }
    ],
    specifications: [
      { label: 'Weight', value: '200g' },
      { label: 'Type', value: 'Cheddar Cheese' },
      { label: 'Aging', value: '6 months' },
      { label: 'Storage', value: 'Keep refrigerated' }
    ],
    rating: 4.5,
    numReviews: 95,
    sales: 420,
    views: 1350,
    timer: 21600,
    tags: ['cheese', 'cheddar', 'dairy', 'aged'],
    isFeatured: false
  },
  {
    name: 'Free Range Eggs 12 Pack',
    slug: 'free-range-eggs-12-pack',
    description: 'Free range eggs from happy chickens. Rich in protein and nutrients.',
    shortDescription: 'Free range eggs',
    category: 'Milk & Dairy',
    subcategory: 'Eggs',
    brand: 'Happy Hens',
    price: 4.99,
    originalPrice: 6.49,
    discount: 23,
    stock: 150,
    sku: 'DAIRY-004',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=600&fit=crop',
        alt: 'Eggs'
      }
    ],
    specifications: [
      { label: 'Quantity', value: '12 eggs' },
      { label: 'Type', value: 'Free Range' },
      { label: 'Size', value: 'Large' },
      { label: 'Storage', value: 'Keep refrigerated' }
    ],
    rating: 4.7,
    numReviews: 180,
    sales: 950,
    views: 2800,
    tags: ['eggs', 'dairy', 'free-range', 'protein'],
    isFeatured: true
  },
  {
    name: 'Whipping Cream 250ml',
    slug: 'whipping-cream-250ml',
    description: 'Fresh whipping cream, perfect for desserts, cakes, and coffee.',
    shortDescription: 'Fresh whipping cream',
    category: 'Milk & Dairy',
    subcategory: 'Milk & Cream',
    brand: 'Pure Dairy',
    price: 3.49,
    originalPrice: 4.99,
    discount: 30,
    stock: 75,
    sku: 'DAIRY-005',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=600&fit=crop',
        alt: 'Whipping Cream'
      }
    ],
    specifications: [
      { label: 'Volume', value: '250ml' },
      { label: 'Type', value: 'Whipping Cream' },
      { label: 'Fat Content', value: '35%' },
      { label: 'Storage', value: 'Keep refrigerated' }
    ],
    rating: 4.4,
    numReviews: 85,
    sales: 320,
    views: 1100,
    tags: ['cream', 'whipping-cream', 'dairy', 'dessert'],
    isFeatured: false
  },
  {
    name: 'Mozzarella Cheese 250g',
    slug: 'mozzarella-cheese-250g',
    description: 'Fresh mozzarella cheese, perfect for pizza, pasta, and salads.',
    shortDescription: 'Fresh mozzarella cheese',
    category: 'Milk & Dairy',
    subcategory: 'Cheese',
    brand: 'Cheese Masters',
    price: 6.49,
    originalPrice: 8.99,
    discount: 28,
    stock: 90,
    sku: 'DAIRY-006',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1536500152107-62eb330a2d0e?w=600&h=600&fit=crop',
        alt: 'Mozzarella Cheese'
      }
    ],
    specifications: [
      { label: 'Weight', value: '250g' },
      { label: 'Type', value: 'Mozzarella' },
      { label: 'Form', value: 'Fresh' },
      { label: 'Best For', value: 'Pizza, Pasta' }
    ],
    rating: 4.6,
    numReviews: 110,
    sales: 480,
    views: 1550,
    timer: 14400,
    tags: ['cheese', 'mozzarella', 'dairy', 'pizza'],
    isFeatured: false
  },

  // FROZEN FOOD (6 products)
  {
    name: 'Vanilla Ice Cream 1L',
    slug: 'vanilla-ice-cream-1l',
    description: 'Creamy vanilla ice cream made with real vanilla beans. Perfect for desserts or as a treat.',
    shortDescription: 'Creamy vanilla ice cream',
    category: 'Frozen Food',
    subcategory: 'Ice Cream & Toppings',
    brand: 'Creamy Delight',
    price: 6.99,
    originalPrice: 9.99,
    discount: 30,
    stock: 85,
    sku: 'FROZEN-001',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=600&fit=crop',
        alt: 'Vanilla Ice Cream'
      }
    ],
    specifications: [
      { label: 'Volume', value: '1 Liter' },
      { label: 'Flavor', value: 'Vanilla' },
      { label: 'Type', value: 'Ice Cream' },
      { label: 'Storage', value: 'Keep frozen' }
    ],
    rating: 4.7,
    numReviews: 140,
    sales: 620,
    views: 1950,
    timer: 43200,
    tags: ['ice-cream', 'vanilla', 'frozen', 'dessert'],
    isFeatured: true
  },
  {
    name: 'Frozen Chicken Nuggets 500g',
    slug: 'frozen-chicken-nuggets-500g',
    description: 'Crispy chicken nuggets, ready to bake or fry. Perfect quick meal for kids.',
    shortDescription: 'Crispy chicken nuggets',
    category: 'Frozen Food',
    subcategory: 'Frozen Snacks',
    brand: 'Quick Bites',
    price: 7.99,
    originalPrice: 10.99,
    discount: 27,
    stock: 110,
    sku: 'FROZEN-002',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=600&fit=crop',
        alt: 'Chicken Nuggets'
      }
    ],
    specifications: [
      { label: 'Weight', value: '500g' },
      { label: 'Type', value: 'Chicken Nuggets' },
      { label: 'Count', value: 'Approx. 25 pieces' },
      { label: 'Cooking', value: 'Ready to cook' }
    ],
    rating: 4.3,
    numReviews: 95,
    sales: 520,
    views: 1650,
    tags: ['chicken', 'nuggets', 'frozen', 'snack'],
    isFeatured: false
  },
  {
    name: 'Frozen Vegetable Lasagna 400g',
    slug: 'frozen-vegetable-lasagna-400g',
    description: 'Vegetable lasagna with layers of pasta, vegetables, and cheese. Ready to bake.',
    shortDescription: 'Vegetable lasagna',
    category: 'Frozen Food',
    subcategory: 'Frozen Meals',
    brand: 'Easy Meals',
    price: 8.99,
    originalPrice: 12.99,
    discount: 31,
    stock: 65,
    sku: 'FROZEN-003',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&h=600&fit=crop',
        alt: 'Vegetable Lasagna'
      }
    ],
    specifications: [
      { label: 'Weight', value: '400g' },
      { label: 'Type', value: 'Vegetable Lasagna' },
      { label: 'Serves', value: '2 people' },
      { label: 'Cooking Time', value: '30 minutes' }
    ],
    rating: 4.5,
    numReviews: 85,
    sales: 380,
    views: 1250,
    timer: 28800,
    tags: ['lasagna', 'vegetable', 'frozen', 'meal'],
    isFeatured: false
  },
  {
    name: 'Chocolate Ice Cream 500ml',
    slug: 'chocolate-ice-cream-500ml',
    description: 'Rich chocolate ice cream made with cocoa. Perfect for chocolate lovers.',
    shortDescription: 'Rich chocolate ice cream',
    category: 'Frozen Food',
    subcategory: 'Frozen Dairy & Desserts',
    brand: 'Creamy Delight',
    price: 5.99,
    originalPrice: 8.49,
    discount: 29,
    stock: 95,
    sku: 'FROZEN-004',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=600&fit=crop',
        alt: 'Chocolate Ice Cream'
      }
    ],
    specifications: [
      { label: 'Volume', value: '500ml' },
      { label: 'Flavor', value: 'Chocolate' },
      { label: 'Type', value: 'Ice Cream' },
      { label: 'Storage', value: 'Keep frozen' }
    ],
    rating: 4.6,
    numReviews: 120,
    sales: 550,
    views: 1750,
    tags: ['ice-cream', 'chocolate', 'frozen', 'dessert'],
    isFeatured: true
  },
  {
    name: 'Frozen French Fries 1kg',
    slug: 'frozen-french-fries-1kg',
    description: 'Crispy french fries, ready to bake or fry. Perfect side dish.',
    shortDescription: 'Crispy french fries',
    category: 'Frozen Food',
    subcategory: 'Frozen Snacks',
    brand: 'Crispy Bites',
    price: 4.99,
    originalPrice: 6.99,
    discount: 29,
    stock: 150,
    sku: 'FROZEN-005',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=600&fit=crop',
        alt: 'French Fries'
      }
    ],
    specifications: [
      { label: 'Weight', value: '1kg' },
      { label: 'Type', value: 'French Fries' },
      { label: 'Cut', value: 'Regular' },
      { label: 'Cooking', value: 'Ready to cook' }
    ],
    rating: 4.4,
    numReviews: 110,
    sales: 720,
    views: 2200,
    tags: ['fries', 'french-fries', 'frozen', 'snack'],
    isFeatured: false
  },
  {
    name: 'Frozen Berry Yogurt 500ml',
    slug: 'frozen-berry-yogurt-500ml',
    description: 'Frozen yogurt with mixed berries. Lower fat alternative to ice cream.',
    shortDescription: 'Berry frozen yogurt',
    category: 'Frozen Food',
    subcategory: 'Frozen Dairy & Desserts',
    brand: 'Healthy Choice',
    price: 6.49,
    originalPrice: 8.99,
    discount: 28,
    stock: 75,
    sku: 'FROZEN-006',
    images: [
      { 
        url: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=600&h=600&fit=crop',
        alt: 'Frozen Yogurt'
      }
    ],
    specifications: [
      { label: 'Volume', value: '500ml' },
      { label: 'Type', value: 'Frozen Yogurt' },
      { label: 'Flavor', value: 'Mixed Berry' },
      { label: 'Fat Content', value: 'Low fat' }
    ],
    rating: 4.5,
    numReviews: 95,
    sales: 420,
    views: 1350,
    timer: 21600,
    tags: ['yogurt', 'frozen', 'berry', 'healthy'],
    isFeatured: false
  }
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@betafore.com',
    password: 'admin123',
    phone: '+1 (555) 123-4567',
    role: 'admin',
    address: {
      street: '123 Admin Street',
      city: 'Admin City',
      state: 'Admin State',
      zipCode: '12345',
      country: 'USA'
    }
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+1 (555) 987-6543',
    role: 'user',
    address: {
      street: '456 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '+1 (555) 456-7890',
    role: 'user',
    address: {
      street: '789 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    }
  }
];

const seedDatabase = async () => {
  try {
    console.log('🚀 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    
    console.log('✅ Database cleared');
    
    // Create categories
    console.log('📁 Creating categories...');
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`✅ Created ${createdCategories.length} categories`);
    
    // Map category names to IDs for product assignment
    const categoryMap = {};
    createdCategories.forEach(category => {
      categoryMap[category.name.toLowerCase()] = category._id;
    });
    
    // Assign categories to products
    const productsWithCategories = sampleProducts.map(product => {
      const categoryName = product.category.toLowerCase();
      const categoryId = categoryMap[categoryName];
      
      if (!categoryId) {
        console.warn(`⚠️  No category found for: ${product.category}, defaulting to Grocery`);
        return {
          ...product,
          category: categoryMap['grocery']
        };
      }
      
      return {
        ...product,
        category: categoryId
      };
    });
    
    // Create products
    console.log('🛍️  Creating products...');
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`✅ Created ${createdProducts.length} products`);
    
    // Hash passwords and create users
    console.log('👤 Creating users...');
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );
    
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Add some products to user's wishlist and cart
    console.log('🛒 Populating user wishlist and cart...');
    
    const adminUser = createdUsers.find(u => u.role === 'admin');
    const regularUser = createdUsers.find(u => u.role === 'user' && u.email === 'john@example.com');
    
    if (adminUser && createdProducts.length >= 10) {
      // Add products to admin's wishlist
      adminUser.wishlist = [
        createdProducts[0]._id,
        createdProducts[2]._id,
        createdProducts[4]._id,
        createdProducts[6]._id,
        createdProducts[8]._id
      ];
      
      // Add products to admin's cart
      adminUser.cart = [
        { product: createdProducts[1]._id, quantity: 2 },
        { product: createdProducts[3]._id, quantity: 1 },
        { product: createdProducts[5]._id, quantity: 3 }
      ];
      
      await adminUser.save();
    }
    
    if (regularUser && createdProducts.length >= 10) {
      // Add products to regular user's wishlist
      regularUser.wishlist = [
        createdProducts[5]._id,
        createdProducts[7]._id,
        createdProducts[9]._id
      ];
      
      // Add products to regular user's cart
      regularUser.cart = [
        { product: createdProducts[0]._id, quantity: 1 },
        { product: createdProducts[6]._id, quantity: 3 },
        { product: createdProducts[8]._id, quantity: 2 }
      ];
      
      await regularUser.save();
    }
    
    console.log('✅ User wishlist and cart populated');
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log(`   Users: ${createdUsers.length}`);
    console.log('\n🔑 Admin Credentials:');
    console.log('   Email: admin@betafore.com');
    console.log('   Password: admin123');
    console.log('\n👤 User Credentials:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');
    console.log('   Email: jane@example.com');
    console.log('   Password: password123');
    console.log('\n📦 Product Distribution:');
    console.log(`   Fruit: ${createdProducts.filter(p => p.category.toString() === categoryMap['fruit'].toString()).length} products`);
    console.log(`   Vegetable: ${createdProducts.filter(p => p.category.toString() === categoryMap['vegetable'].toString()).length} products`);
    console.log(`   Drink & Food: ${createdProducts.filter(p => p.category.toString() === categoryMap['drink & food'].toString()).length} products`);
    console.log(`   Meat: ${createdProducts.filter(p => p.category.toString() === categoryMap['meat'].toString()).length} products`);
    console.log(`   Fish: ${createdProducts.filter(p => p.category.toString() === categoryMap['fish'].toString()).length} products`);
    console.log(`   Grocery: ${createdProducts.filter(p => p.category.toString() === categoryMap['grocery'].toString()).length} products`);
    console.log(`   Milk & Dairy: ${createdProducts.filter(p => p.category.toString() === categoryMap['milk & dairy'].toString()).length} products`);
    console.log(`   Frozen Food: ${createdProducts.filter(p => p.category.toString() === categoryMap['frozen food'].toString()).length} products`);
    console.log('\n🚀 Server is ready to use!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();