const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample data
const sampleCategories = [
  {
    name: 'Fruit',
    slug: 'fruit',
    description: 'Fresh and organic fruits',
    icon: 'https://cdn-icons-png.flaticon.com/512/415/415733.png',
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
    icon: 'https://cdn-icons-png.flaticon.com/512/2329/2329865.png',
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
    name: 'Meat',
    slug: 'meat',
    description: 'Fresh meat and poultry',
    icon: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
    image: 'https://images.unsplash.com/photo-1603048297172-c609bb5e5c7d',
    subcategories: [
      { name: 'Beef & Steak', slug: 'beef-steak' },
      { name: 'Chicken', slug: 'chicken' },
      { name: 'Mutton & Goat', slug: 'mutton-goat' },
      { name: 'Lamb', slug: 'lamb' }
    ],
    isFeatured: true,
    order: 3
  },
  {
    name: 'Fish',
    slug: 'fish',
    description: 'Fresh and frozen seafood',
    icon: 'https://cdn-icons-png.flaticon.com/512/3079/3079015.png',
    image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6',
    subcategories: [
      { name: 'Dried Fish', slug: 'dried-fish' },
      { name: 'Fish Filling & Steaks', slug: 'fish-filling-steaks' },
      { name: 'Frozen Seafood', slug: 'frozen-seafood' },
      { name: 'Prawn Shrimp', slug: 'prawn-shrimp' }
    ],
    isFeatured: true,
    order: 4
  },
  {
    name: 'Grocery',
    slug: 'grocery',
    description: 'Daily grocery items',
    icon: 'https://cdn-icons-png.flaticon.com/512/871/871399.png',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
    subcategories: [
      { name: 'Canned & Packed Food', slug: 'canned-packed-food' },
      { name: 'Beauty Products', slug: 'beauty-products' },
      { name: 'Masala & Spices', slug: 'masala-spices' },
      { name: 'Dry Fruits & Nut', slug: 'dry-fruits-nut' }
    ],
    isFeatured: true,
    order: 5
  },
  {
    name: 'Milk & Dairy',
    slug: 'milk-dairy',
    description: 'Fresh dairy products',
    icon: 'https://cdn-icons-png.flaticon.com/512/2433/2433312.png',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
    subcategories: [
      { name: 'Cheese', slug: 'cheese' },
      { name: 'Milk & Cream', slug: 'milk-cream' },
      { name: 'Yogurt', slug: 'yogurt' },
      { name: 'Eggs', slug: 'eggs' }
    ],
    isFeatured: true,
    order: 6
  },
  {
    name: 'Frozen Food',
    slug: 'frozen-food',
    description: 'Frozen food items',
    icon: 'https://cdn-icons-png.flaticon.com/512/2936/2936886.png',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    subcategories: [
      { name: 'Ice Cream & Toppings', slug: 'ice-cream-toppings' },
      { name: 'Frozen Snacks', slug: 'frozen-snacks' },
      { name: 'Frozen Meals', slug: 'frozen-meals' },
      { name: 'Frozen Dairy & Desserts', slug: 'frozen-dairy-desserts' }
    ],
    isFeatured: true,
    order: 7
  },
  {
    name: 'Drink & Food',
    slug: 'drink-food',
    description: 'Beverages and ready-to-eat food',
    icon: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9',
    subcategories: [
      { name: 'All Restaurant', slug: 'all-restaurant' },
      { name: 'Juice and Drinks', slug: 'juice-drinks' },
      { name: 'Breakfast', slug: 'breakfast' },
      { name: 'Fast Food', slug: 'fast-food' }
    ],
    isFeatured: true,
    order: 8
  }
];

const sampleProducts = [
  {
    name: 'HALAL TURKEY (AROUND 12-13 LB)',
    slug: 'halal-turkey-around-12-13-lb',
    description: 'Premium halal turkey, carefully sourced and processed following strict halal guidelines. Perfect for family gatherings, special occasions, and festive meals.',
    shortDescription: 'Premium halal turkey for special occasions',
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
    name: 'OLIO VILLA BLENDED PROMACE OIL 3.785L',
    slug: 'olio-villa-blended-promace-oil-3-785l',
    description: 'Premium blended promace oil suitable for all types of cooking including frying, sautéing, and baking. Low cholesterol and rich in nutrients.',
    shortDescription: 'Premium blended cooking oil',
    subcategory: 'Cooking Oil',
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
    tags: ['oil', 'cooking', 'grocery'],
    isFeatured: true
  },
  {
    name: 'Big Potatoes 1 Kg',
    slug: 'big-potatoes-1-kg',
    description: 'Fresh, organic potatoes perfect for boiling, baking, frying, and mashing. Rich in vitamins and minerals, sourced directly from local farms.',
    shortDescription: 'Fresh organic potatoes',
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
    tags: ['vegetable', 'organic', 'potato'],
    isFeatured: true
  },
  {
    name: 'Fresh Chicken Breast 500g',
    slug: 'fresh-chicken-breast-500g',
    description: 'Boneless, skinless chicken breast. Perfect for grilling, baking, or stir-frying. High in protein and low in fat.',
    shortDescription: 'Boneless skinless chicken breast',
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
    tags: ['chicken', 'meat', 'protein'],
    isFeatured: true
  },
  {
    name: 'Premium Basmati Rice 5kg',
    slug: 'premium-basmati-rice-5kg',
    description: 'Long grain basmati rice with aromatic fragrance. Perfect for biryanis, pilafs, and everyday meals.',
    shortDescription: 'Long grain aromatic basmati rice',
    subcategory: 'Rice & Grains',
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
    tags: ['rice', 'basmati', 'grain'],
    isFeatured: true
  },
  {
    name: 'Fresh Milk 1L',
    slug: 'fresh-milk-1l',
    description: 'Fresh pasteurized milk, rich in calcium and vitamins. Perfect for drinking, cooking, and baking.',
    shortDescription: 'Fresh pasteurized full cream milk',
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
    tags: ['milk', 'dairy', 'fresh'],
    isFeatured: true
  },
  {
    name: 'Organic Apples 1kg',
    slug: 'organic-apples-1kg',
    description: 'Fresh organic apples, crisp and juicy. Rich in fiber and antioxidants.',
    shortDescription: 'Fresh organic apples',
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
      { label: 'Origin', value: 'Local Orchard' }
    ],
    rating: 4.7,
    numReviews: 95,
    sales: 780,
    views: 2100,
    timer: 14400,
    tags: ['apple', 'fruit', 'organic'],
    isFeatured: true
  },
  {
    name: 'Frozen Shrimp 500g',
    slug: 'frozen-shrimp-500g',
    description: 'Premium frozen shrimp, ready to cook. Perfect for stir-fries, curries, and grilling.',
    shortDescription: 'Premium frozen shrimp',
    subcategory: 'Frozen Seafood',
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
    tags: ['shrimp', 'seafood', 'frozen'],
    isFeatured: true
  },
  {
    name: 'Greek Yogurt 500g',
    slug: 'greek-yogurt-500g',
    description: 'Creamy Greek yogurt, high in protein and probiotics. Perfect for breakfast, smoothies, or as a healthy snack.',
    shortDescription: 'Creamy high-protein Greek yogurt',
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
    tags: ['yogurt', 'dairy', 'protein'],
    isFeatured: false
  },
  {
    name: 'Extra Virgin Olive Oil 1L',
    slug: 'extra-virgin-olive-oil-1l',
    description: 'Cold-pressed extra virgin olive oil, rich in antioxidants. Perfect for salads, dressings, and light cooking.',
    shortDescription: 'Cold-pressed extra virgin olive oil',
    subcategory: 'Cooking Oil',
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
    tags: ['olive-oil', 'healthy', 'cooking'],
    isFeatured: true
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
      let categoryId;
      
      // Map product to category based on type
      if (product.name.toLowerCase().includes('turkey') || 
          product.name.toLowerCase().includes('chicken')) {
        categoryId = categoryMap['meat'];
      } else if (product.name.toLowerCase().includes('potato')) {
        categoryId = categoryMap['vegetable'];
      } else if (product.name.toLowerCase().includes('oil')) {
        categoryId = categoryMap['grocery'];
      } else if (product.name.toLowerCase().includes('rice')) {
        categoryId = categoryMap['grocery'];
      } else if (product.name.toLowerCase().includes('milk') || 
                 product.name.toLowerCase().includes('yogurt')) {
        categoryId = categoryMap['milk & dairy'];
      } else if (product.name.toLowerCase().includes('apple')) {
        categoryId = categoryMap['fruit'];
      } else if (product.name.toLowerCase().includes('shrimp')) {
        categoryId = categoryMap['fish'];
      } else {
        // Default to grocery
        categoryId = categoryMap['grocery'];
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
    
    if (adminUser && createdProducts.length >= 3) {
      // Add products to admin's wishlist
      adminUser.wishlist = [
        createdProducts[0]._id,
        createdProducts[2]._id,
        createdProducts[4]._id
      ];
      
      // Add products to admin's cart
      adminUser.cart = [
        { product: createdProducts[1]._id, quantity: 2 },
        { product: createdProducts[3]._id, quantity: 1 }
      ];
      
      await adminUser.save();
    }
    
    if (regularUser && createdProducts.length >= 4) {
      // Add products to regular user's wishlist
      regularUser.wishlist = [
        createdProducts[5]._id,
        createdProducts[7]._id
      ];
      
      // Add products to regular user's cart
      regularUser.cart = [
        { product: createdProducts[0]._id, quantity: 1 },
        { product: createdProducts[6]._id, quantity: 3 }
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
    console.log('\n🚀 Server is ready to use!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();