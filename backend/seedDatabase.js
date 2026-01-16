const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
  .then(() => console.log('MongoDB Connected for seeding...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample Categories
const sampleCategories = [
  {
    name: 'Fruit',
    slug: 'fruit',
    description: 'Fresh and delicious fruits',
    icon: '🍎',
    image: '/images/fruits.jpg',
    isFeatured: true,
    isActive: true,
    order: 1,
    subcategories: [
      { name: 'Fresh Fruit', slug: 'fresh-fruit' },
      { name: 'Frozen Fruit', slug: 'frozen-fruit' },
      { name: 'Seasonal Fruit', slug: 'seasonal-fruit' },
      { name: 'Dried Fruit', slug: 'dried-fruit' }
    ]
  },
  {
    name: 'Vegetable',
    slug: 'vegetable',
    description: 'Organic and fresh vegetables',
    icon: '🥕',
    image: '/images/vegetables.jpg',
    isFeatured: true,
    isActive: true,
    order: 2,
    subcategories: [
      { name: 'Fresh Vegetable', slug: 'fresh-vegetable' },
      { name: 'Frozen Vegetable', slug: 'frozen-vegetable' },
      { name: 'Seasonal Vegetable', slug: 'seasonal-vegetable' },
      { name: 'Root Vegetable', slug: 'root-vegetable' }
    ]
  },
  {
    name: 'Meat',
    slug: 'meat',
    description: 'Premium quality meat products',
    icon: '🥩',
    image: '/images/meat.jpg',
    isFeatured: true,
    isActive: true,
    order: 3,
    subcategories: [
      { name: 'Beef & Steak', slug: 'beef-steak' },
      { name: 'Chicken', slug: 'chicken' },
      { name: 'Mutton & Goat', slug: 'mutton-goat' },
      { name: 'Lamb', slug: 'lamb' }
    ]
  },
  {
    name: 'Fish',
    slug: 'fish',
    description: 'Fresh and frozen seafood',
    icon: '🐟',
    image: '/images/fish.jpg',
    isFeatured: true,
    isActive: true,
    order: 4,
    subcategories: [
      { name: 'Dried Fish', slug: 'dried-fish' },
      { name: 'Fish Filling & Steaks', slug: 'fish-filling-steaks' },
      { name: 'Frozen Seafood', slug: 'frozen-seafood' },
      { name: 'Prawn Shrimp', slug: 'prawn-shrimp' }
    ]
  },
  {
    name: 'Grocery',
    slug: 'grocery',
    description: 'Daily grocery items',
    icon: '🛒',
    image: '/images/grocery.jpg',
    isFeatured: true,
    isActive: true,
    order: 5,
    subcategories: [
      { name: 'Canned & Packed Food', slug: 'canned-packed-food' },
      { name: 'Beauty Products', slug: 'beauty-products' },
      { name: 'Masala & Spices', slug: 'masala-spices' },
      { name: 'Dry Fruits & Nut', slug: 'dry-fruits-nut' }
    ]
  },
  {
    name: 'Milk & Dairy',
    slug: 'milk-dairy',
    description: 'Fresh dairy products',
    icon: '🥛',
    image: '/images/dairy.jpg',
    isFeatured: true,
    isActive: true,
    order: 6,
    subcategories: [
      { name: 'Cheese', slug: 'cheese' },
      { name: 'Milk & Cream', slug: 'milk-cream' },
      { name: 'Yogurt', slug: 'yogurt' },
      { name: 'Eggs', slug: 'eggs' }
    ]
  },
  {
    name: 'Frozen Food',
    slug: 'frozen-food',
    description: 'Quick frozen meals and snacks',
    icon: '❄️',
    image: '/images/frozen-food.jpg',
    isFeatured: true,
    isActive: true,
    order: 7,
    subcategories: [
      { name: 'Ice Cream & Toppings', slug: 'ice-cream-toppings' },
      { name: 'Frozen Snacks', slug: 'frozen-snacks' },
      { name: 'Frozen Meals', slug: 'frozen-meals' },
      { name: 'Frozen Dairy & Desserts', slug: 'frozen-dairy-desserts' }
    ]
  }
];

// Sample Products
const sampleProducts = [
  // Fruit Category Products
  {
    name: 'HALAL TURKEY (AROUND 12-13 LB)',
    slug: 'halal-turkey-12-13-lb',
    description: 'Premium halal turkey, carefully sourced and processed following strict halal guidelines. Perfect for family gatherings, special occasions, and festive meals.',
    shortDescription: 'Premium Halal Turkey',
    brand: 'Premium Halal',
    price: 28.07,
    originalPrice: 35.60,
    discount: 21,
    stock: 50,
    sku: 'TUR-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1587590227264-0ac64ce63ce8?w=600&h=600&fit=crop', alt: 'Halal Turkey' }
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
    timer: 86400, // 24 hours
    tags: ['halal', 'turkey', 'meat', 'premium'],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'Fresh Apples (1kg)',
    slug: 'fresh-apples-1kg',
    description: 'Fresh organic apples, crisp and juicy. Perfect for snacking, baking, or making juice.',
    shortDescription: 'Fresh Organic Apples',
    brand: 'Organic Farm',
    price: 4.99,
    originalPrice: 6.99,
    discount: 29,
    stock: 150,
    sku: 'APP-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&h=600&fit=crop', alt: 'Fresh Apples' }
    ],
    specifications: [
      { label: 'Weight', value: '1kg' },
      { label: 'Type', value: 'Organic' },
      { label: 'Variety', value: 'Gala Apples' },
      { label: 'Storage', value: 'Cool dry place' },
      { label: 'Origin', value: 'Local Farm' }
    ],
    rating: 4.7,
    numReviews: 95,
    sales: 780,
    views: 2100,
    tags: ['organic', 'fruit', 'fresh', 'healthy'],
    isFeatured: true,
    isActive: true
  },
  
  // Vegetable Category Products
  {
    name: 'Big Potatoes 1 Kg',
    slug: 'big-potatoes-1kg',
    description: 'Fresh, organic potatoes perfect for boiling, baking, frying, and mashing. Rich in vitamins and minerals, sourced directly from local farms.',
    shortDescription: 'Organic Potatoes',
    brand: 'Organic Farm',
    price: 10.99,
    originalPrice: 35.60,
    discount: 69,
    stock: 200,
    sku: 'POT-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop', alt: 'Potatoes' }
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
    timer: 7200, // 2 hours
    tags: ['organic', 'vegetable', 'potato', 'fresh'],
    isFeatured: true,
    isActive: true
  },
  
  // Meat Category Products
  {
    name: 'Fresh Chicken Breast 500g',
    slug: 'fresh-chicken-breast-500g',
    description: 'Boneless, skinless chicken breast. Perfect for grilling, baking, or stir-frying. High in protein and low in fat.',
    shortDescription: 'Boneless Chicken Breast',
    brand: 'Farm Fresh',
    price: 8.99,
    originalPrice: 12.99,
    discount: 31,
    stock: 100,
    sku: 'CHK-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1589987607627-8cfae2d0ebd4?w=600&h=600&fit=crop', alt: 'Chicken Breast' }
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
    timer: 3600, // 1 hour
    tags: ['chicken', 'meat', 'protein', 'fresh'],
    isFeatured: true,
    isActive: true
  },
  
  // Grocery Category Products
  {
    name: 'OLIO VILLA BLENDED PROMACE OIL 3.785L',
    slug: 'olio-villa-blended-promace-oil-3-785l',
    description: 'Premium blended promace oil suitable for all types of cooking including frying, sautéing, and baking. Low cholesterol and rich in nutrients.',
    shortDescription: 'Premium Cooking Oil',
    brand: 'Olio Villa',
    price: 13.99,
    originalPrice: 25.60,
    discount: 45,
    stock: 80,
    sku: 'OIL-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=600&h=600&fit=crop', alt: 'Cooking Oil' }
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
    timer: 43200, // 12 hours
    tags: ['cooking oil', 'grocery', 'kitchen'],
    isFeatured: true,
    isActive: true
  },
  
  {
    name: 'Premium Basmati Rice 5kg',
    slug: 'premium-basmati-rice-5kg',
    description: 'Long grain basmati rice with aromatic fragrance. Perfect for biryanis, pilafs, and everyday meals.',
    shortDescription: 'Aromatic Basmati Rice',
    brand: 'Royal Harvest',
    price: 15.99,
    originalPrice: 19.99,
    discount: 20,
    stock: 120,
    sku: 'RIC-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop', alt: 'Basmati Rice' }
    ],
    specifications: [
      { label: 'Weight', value: '5kg' },
      { label: 'Type', value: 'Basmati Rice' },
      { label: 'Grain', value: 'Long Grain' },
      { label: 'Origin', value: 'India' },
      { label: 'Cooking Time', value: '15-20 minutes' }
    ],
    rating: 4.6,
    numReviews: 210,
    sales: 1200,
    views: 3500,
    timer: 172800, // 48 hours
    tags: ['rice', 'grocery', 'staple'],
    isFeatured: true,
    isActive: true
  },
  
  // Dairy Category Products
  {
    name: 'Fresh Milk 1L',
    slug: 'fresh-milk-1l',
    description: 'Fresh pasteurized milk, rich in calcium and vitamins. Perfect for drinking, cooking, and baking.',
    shortDescription: 'Pasteurized Fresh Milk',
    brand: 'Pure Dairy',
    price: 2.99,
    originalPrice: 3.49,
    discount: 14,
    stock: 200,
    sku: 'MLK-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=600&fit=crop', alt: 'Fresh Milk' }
    ],
    specifications: [
      { label: 'Volume', value: '1 Liter' },
      { label: 'Type', value: 'Full Cream' },
      { label: 'Storage', value: 'Keep refrigerated' },
      { label: 'Best Before', value: '7 days' },
      { label: 'Fat Content', value: '3.5%' }
    ],
    rating: 4.4,
    numReviews: 150,
    sales: 2300,
    views: 4200,
    timer: 28800, // 8 hours
    tags: ['milk', 'dairy', 'fresh'],
    isFeatured: true,
    isActive: true
  },
  
  // Fish Category Products
  {
    name: 'Frozen Shrimp 500g',
    slug: 'frozen-shrimp-500g',
    description: 'Premium frozen shrimp, ready to cook. Perfect for stir-fries, curries, and grilling.',
    shortDescription: 'Premium Frozen Shrimp',
    brand: 'Ocean Fresh',
    price: 12.99,
    originalPrice: 16.99,
    discount: 24,
    stock: 75,
    sku: 'SHR-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=600&h=600&fit=crop', alt: 'Frozen Shrimp' }
    ],
    specifications: [
      { label: 'Weight', value: '500g' },
      { label: 'Type', value: 'Peeled & Deveined' },
      { label: 'Size', value: 'Medium (31-40 count)' },
      { label: 'Storage', value: 'Keep frozen' },
      { label: 'Origin', value: 'Coastal Farm' }
    ],
    rating: 4.5,
    numReviews: 85,
    sales: 420,
    views: 1300,
    timer: 57600, // 16 hours
    tags: ['shrimp', 'seafood', 'frozen'],
    isFeatured: true,
    isActive: true
  },
  
  // More products for variety
  {
    name: 'Organic Bananas (6 pcs)',
    slug: 'organic-bananas-6pcs',
    description: 'Fresh organic bananas, perfect for breakfast, smoothies, or baking.',
    shortDescription: 'Organic Bananas',
    brand: 'Tropical Farm',
    price: 3.49,
    originalPrice: 4.99,
    discount: 30,
    stock: 180,
    sku: 'BAN-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop', alt: 'Bananas' }
    ],
    rating: 4.6,
    numReviews: 110,
    sales: 920,
    views: 2800,
    tags: ['banana', 'fruit', 'organic'],
    isFeatured: false,
    isActive: true
  },
  
  {
    name: 'Fresh Carrots 1kg',
    slug: 'fresh-carrots-1kg',
    description: 'Fresh organic carrots, rich in vitamin A and antioxidants.',
    shortDescription: 'Organic Carrots',
    brand: 'Vegetable King',
    price: 2.99,
    originalPrice: 3.99,
    discount: 25,
    stock: 160,
    sku: 'CAR-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1598170845058-78131a90f4bf?w=600&h=600&fit=crop', alt: 'Carrots' }
    ],
    rating: 4.4,
    numReviews: 95,
    sales: 780,
    views: 2100,
    tags: ['carrot', 'vegetable', 'organic'],
    isFeatured: false,
    isActive: true
  },
  
  {
    name: 'Fresh Beef Steak 300g',
    slug: 'fresh-beef-steak-300g',
    description: 'Premium quality beef steak, perfect for grilling or pan-frying.',
    shortDescription: 'Beef Steak',
    brand: 'Prime Cuts',
    price: 18.99,
    originalPrice: 24.99,
    discount: 24,
    stock: 40,
    sku: 'BEEF-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=600&fit=crop', alt: 'Beef Steak' }
    ],
    rating: 4.7,
    numReviews: 65,
    sales: 320,
    views: 1500,
    tags: ['beef', 'steak', 'meat'],
    isFeatured: false,
    isActive: true
  },
  
  {
    name: 'Fresh Salmon Fillet 400g',
    slug: 'fresh-salmon-fillet-400g',
    description: 'Fresh salmon fillet, rich in omega-3 fatty acids.',
    shortDescription: 'Salmon Fillet',
    brand: 'Ocean Fresh',
    price: 14.99,
    originalPrice: 18.99,
    discount: 21,
    stock: 35,
    sku: 'SAL-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=600&fit=crop', alt: 'Salmon' }
    ],
    rating: 4.8,
    numReviews: 120,
    sales: 450,
    views: 1800,
    tags: ['salmon', 'fish', 'seafood'],
    isFeatured: true,
    isActive: true
  }
];

// Sample Admin User
const adminUser = {
  name: 'Admin User',
  email: 'admin@dhakaagro.com',
  password: 'Admin@123',
  phone: '+8801234567890',
  role: 'admin',
  address: {
    street: '123 Admin Street',
    city: 'Dhaka',
    state: 'Dhaka',
    zipCode: '1207',
    country: 'Bangladesh'
  },
  emailVerified: true
};

// Seed function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Insert categories and get their IDs
    const insertedCategories = await Category.insertMany(sampleCategories);
    console.log(`Inserted ${insertedCategories.length} categories`);
    
    // Create a map of category names to IDs
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.name.toLowerCase()] = cat._id;
    });
    
    // Assign categories to products
    const productsWithCategories = sampleProducts.map(product => {
      let categoryId;
      
      // Assign category based on product name/type
      if (product.name.toLowerCase().includes('turkey') || 
          product.name.toLowerCase().includes('chicken') || 
          product.name.toLowerCase().includes('beef') || 
          product.name.toLowerCase().includes('steak')) {
        categoryId = categoryMap['meat'];
        return { ...product, category: categoryId, subcategory: 'Chicken' };
      }
      else if (product.name.toLowerCase().includes('apple') || 
               product.name.toLowerCase().includes('banana')) {
        categoryId = categoryMap['fruit'];
        return { ...product, category: categoryId, subcategory: 'Fresh Fruit' };
      }
      else if (product.name.toLowerCase().includes('potato') || 
               product.name.toLowerCase().includes('carrot')) {
        categoryId = categoryMap['vegetable'];
        return { ...product, category: categoryId, subcategory: 'Fresh Vegetable' };
      }
      else if (product.name.toLowerCase().includes('oil') || 
               product.name.toLowerCase().includes('rice')) {
        categoryId = categoryMap['grocery'];
        return { ...product, category: categoryId, subcategory: 'Canned & Packed Food' };
      }
      else if (product.name.toLowerCase().includes('milk')) {
        categoryId = categoryMap['milk & dairy'];
        return { ...product, category: categoryId, subcategory: 'Milk & Cream' };
      }
      else if (product.name.toLowerCase().includes('shrimp') || 
               product.name.toLowerCase().includes('salmon')) {
        categoryId = categoryMap['fish'];
        return { ...product, category: categoryId, subcategory: 'Frozen Seafood' };
      }
      else {
        // Default to first category
        categoryId = categoryMap['fruit'];
        return { ...product, category: categoryId, subcategory: 'Fresh Fruit' };
      }
    });
    
    // Insert products
    const insertedProducts = await Product.insertMany(productsWithCategories);
    console.log(`Inserted ${insertedProducts.length} products`);
    
    // Check if admin user exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (!existingAdmin) {
      await User.create(adminUser);
      console.log('Created admin user');
    } else {
      console.log('Admin user already exists');
    }
    
    console.log('Database seeding completed successfully!');
    console.log('\n=== Summary ===');
    console.log(`Categories: ${insertedCategories.length}`);
    console.log(`Products: ${insertedProducts.length}`);
    console.log('\nYou can now access:');
    console.log('1. http://localhost:5000/api/products');
    console.log('2. http://localhost:5000/api/categories');
    console.log('3. Admin Login: admin@dhakaagro.com / Admin@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();