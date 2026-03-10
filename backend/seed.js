const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Inventory = require('./models/Inventory');
const Pizza = require('./models/Pizza');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Inventory.deleteMany({});
    await Pizza.deleteMany({});

    // 1. Add 5 items for each customization section
    const inventoryItems = [
      // Bases
      { itemName: 'Thin Crust', category: 'base', quantity: 100, price: 50 },
      { itemName: 'Thick Crust', category: 'base', quantity: 100, price: 60 },
      { itemName: 'Cheese Burst', category: 'base', quantity: 100, price: 90 },
      { itemName: 'Wheat Base', category: 'base', quantity: 100, price: 55 },
      { itemName: 'Gluten Free', category: 'base', quantity: 100, price: 80 },

      // Sauces
      { itemName: 'Classic Tomato', category: 'sauce', quantity: 100, price: 20 },
      { itemName: 'Spicy Marinara', category: 'sauce', quantity: 100, price: 25 },
      { itemName: 'Barbecue', category: 'sauce', quantity: 100, price: 30 },
      { itemName: 'Pesto', category: 'sauce', quantity: 100, price: 40 },
      { itemName: 'Garlic Parmesan', category: 'sauce', quantity: 100, price: 35 },

      // Cheese
      { itemName: 'Mozzarella', category: 'cheese', quantity: 100, price: 40 },
      { itemName: 'Cheddar', category: 'cheese', quantity: 100, price: 45 },
      { itemName: 'Paneer (Cottage Cheese)', category: 'cheese', quantity: 100, price: 50 },
      { itemName: 'Feta', category: 'cheese', quantity: 100, price: 60 },
      { itemName: 'Gouda', category: 'cheese', quantity: 100, price: 55 },

      // Veggies
      { itemName: 'Onions', category: 'veggies', quantity: 100, price: 15 },
      { itemName: 'Capsicum', category: 'veggies', quantity: 100, price: 15 },
      { itemName: 'Mushrooms', category: 'veggies', quantity: 100, price: 25 },
      { itemName: 'Black Olives', category: 'veggies', quantity: 100, price: 30 },
      { itemName: 'Jalapenos', category: 'veggies', quantity: 100, price: 20 },

      // Meat
      { itemName: 'Pepperoni', category: 'meat', quantity: 100, price: 60 },
      { itemName: 'Grilled Chicken', category: 'meat', quantity: 100, price: 50 },
      { itemName: 'BBQ Chicken', category: 'meat', quantity: 100, price: 55 },
      { itemName: 'Bacon', category: 'meat', quantity: 100, price: 70 },
      { itemName: 'Sausage', category: 'meat', quantity: 100, price: 45 },
    ];

    await Inventory.insertMany(inventoryItems);
    console.log('Inventory seeded!');

    // 2. Add some pre-defined non-customized pizzas
    const preDefinedPizzas = [
      {
        name: 'Margherita',
        description: 'Classic delight with 100% real mozzarella cheese',
        base: 'Thin Crust',
        sauce: 'Classic Tomato',
        cheese: 'Mozzarella',
        veggies: [],
        price: 299,
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=1974&auto=format&fit=crop'
      },
      {
        name: 'Farmhouse',
        description: 'Delightful combination of onion, capsicum, tomato & grilled mushroom',
        base: 'Thick Crust',
        sauce: 'Classic Tomato',
        cheese: 'Mozzarella',
        veggies: ['Onions', 'Capsicum', 'Mushrooms'],
        price: 399,
        image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?q=80&w=1854&auto=format&fit=crop'
      },
      {
        name: 'Peppy Paneer',
        description: 'Flavorful paneer, capsicum, and spicy red pepper',
        base: 'Thin Crust',
        sauce: 'Spicy Marinara',
        cheese: 'Paneer (Cottage Cheese)',
        veggies: ['Capsicum'],
        price: 449,
        image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=1925&auto=format&fit=crop'
      },
      {
        name: 'Chicken Dominator',
        description: 'Loaded with double pepper barbecue chicken, peri-peri chicken, and chicken sausage',
        base: 'Cheese Burst',
        sauce: 'Barbecue',
        cheese: 'Mozzarella',
        meat: ['BBQ Chicken', 'Sausage'],
        price: 599,
        image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=1928&auto=format&fit=crop'
      },
      {
        name: 'Veggie Paradise',
        description: 'Goldern corn, black olives, capsicum, red paprika',
        base: 'Thin Crust',
        sauce: 'Classic Tomato',
        cheese: 'Cheddar',
        veggies: ['Black Olives', 'Capsicum'],
        price: 349,
        image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=1888&auto=format&fit=crop'
      }
    ];

    await Pizza.insertMany(preDefinedPizzas);
    console.log('Pre-defined pizzas seeded!');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
