import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@foodie.com', password, role: 'admin' },
  });

  const owner1 = await prisma.user.create({
    data: { name: 'Rajesh Kumar', email: 'rajesh@restaurant.com', password, role: 'owner' },
  });

  const owner2 = await prisma.user.create({
    data: { name: 'Priya Sharma', email: 'priya@restaurant.com', password, role: 'owner' },
  });

  const user = await prisma.user.create({
    data: { name: 'John Doe', email: 'john@user.com', password, role: 'user', phone: '9876543210' },
  });

  const restaurant1 = await prisma.restaurant.create({
    data: {
      ownerId: owner1.id,
      name: 'Spice Garden',
      description: 'Authentic North Indian cuisine with a modern twist. Fresh ingredients, bold flavors.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      address: '123 MG Road',
      city: 'Mumbai',
      cuisine: 'North Indian',
      rating: 4.5,
      isApproved: true,
      deliveryTime: '25-35 min',
      deliveryFee: 30,
    },
  });

  const restaurant2 = await prisma.restaurant.create({
    data: {
      ownerId: owner1.id,
      name: 'Dragon Wok',
      description: 'Premium Chinese and Pan-Asian dishes made with authentic sauces and fresh vegetables.',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
      address: '456 FC Road',
      city: 'Mumbai',
      cuisine: 'Chinese',
      rating: 4.2,
      isApproved: true,
      deliveryTime: '30-40 min',
      deliveryFee: 25,
    },
  });

  const restaurant3 = await prisma.restaurant.create({
    data: {
      ownerId: owner2.id,
      name: 'Pizza Paradise',
      description: 'Wood-fired pizzas with premium toppings and homemade sauces. Italian perfection.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      address: '789 Brigade Road',
      city: 'Bangalore',
      cuisine: 'Italian',
      rating: 4.7,
      isApproved: true,
      deliveryTime: '20-30 min',
      deliveryFee: 40,
    },
  });

  const restaurant4 = await prisma.restaurant.create({
    data: {
      ownerId: owner2.id,
      name: 'Biryani House',
      description: 'Legendary Hyderabadi biryani slow-cooked with aromatic spices and premium basmati rice.',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      address: '321 Jubilee Hills',
      city: 'Hyderabad',
      cuisine: 'Biryani',
      rating: 4.8,
      isApproved: true,
      deliveryTime: '35-45 min',
      deliveryFee: 20,
    },
  });

  const restaurant5 = await prisma.restaurant.create({
    data: {
      ownerId: owner1.id,
      name: 'Burger Barn',
      description: 'Gourmet burgers with juicy patties, artisan buns, and handcut fries.',
      image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800',
      address: '654 Park Street',
      city: 'Delhi',
      cuisine: 'American',
      rating: 4.3,
      isApproved: true,
      deliveryTime: '20-30 min',
      deliveryFee: 35,
    },
  });

  const restaurant6 = await prisma.restaurant.create({
    data: {
      ownerId: owner2.id,
      name: 'Dosa Factory',
      description: 'Crispy dosas, fluffy idlis, and authentic South Indian flavors since 1995.',
      image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800',
      address: '987 Anna Nagar',
      city: 'Chennai',
      cuisine: 'South Indian',
      rating: 4.6,
      isApproved: true,
      deliveryTime: '15-25 min',
      deliveryFee: 15,
    },
  });

  // Menu items for Spice Garden
  await prisma.menuItem.createMany({
    data: [
      { restaurantId: restaurant1.id, name: 'Butter Chicken', description: 'Tender chicken in creamy tomato butter sauce', price: 320, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' },
      { restaurantId: restaurant1.id, name: 'Paneer Tikka Masala', description: 'Grilled paneer cubes in spiced gravy', price: 280, category: 'Main Course', isVeg: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400' },
      { restaurantId: restaurant1.id, name: 'Dal Makhani', description: 'Black lentils slow cooked overnight', price: 220, category: 'Main Course', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
      { restaurantId: restaurant1.id, name: 'Garlic Naan', description: 'Freshly baked with garlic and butter', price: 60, category: 'Bread', isVeg: true },
      { restaurantId: restaurant1.id, name: 'Chicken Biryani', description: 'Fragrant basmati rice with spiced chicken', price: 350, category: 'Rice', isVeg: false },
      { restaurantId: restaurant1.id, name: 'Gulab Jamun', description: 'Soft milk dumplings in sugar syrup', price: 120, category: 'Dessert', isVeg: true },
      { restaurantId: restaurant1.id, name: 'Mango Lassi', description: 'Fresh mango yogurt smoothie', price: 90, category: 'Beverages', isVeg: true },
    ],
  });

  // Menu items for Dragon Wok
  await prisma.menuItem.createMany({
    data: [
      { restaurantId: restaurant2.id, name: 'Kung Pao Chicken', description: 'Spicy chicken with peanuts and vegetables', price: 290, category: 'Main Course', isVeg: false },
      { restaurantId: restaurant2.id, name: 'Veg Manchurian', description: 'Crispy vegetable balls in tangy sauce', price: 220, category: 'Starters', isVeg: true },
      { restaurantId: restaurant2.id, name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables', price: 200, category: 'Noodles', isVeg: true },
      { restaurantId: restaurant2.id, name: 'Chicken Fried Rice', description: 'Wok-tossed rice with chicken and eggs', price: 250, category: 'Rice', isVeg: false },
      { restaurantId: restaurant2.id, name: 'Spring Rolls', description: 'Crispy rolls with vegetable filling', price: 180, category: 'Starters', isVeg: true },
      { restaurantId: restaurant2.id, name: 'Hot & Sour Soup', description: 'Classic spicy and tangy soup', price: 150, category: 'Soup', isVeg: true },
    ],
  });

  // Menu items for Pizza Paradise
  await prisma.menuItem.createMany({
    data: [
      { restaurantId: restaurant3.id, name: 'Margherita Pizza', description: 'Classic tomato, mozzarella, and basil', price: 350, category: 'Pizza', isVeg: true, image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400' },
      { restaurantId: restaurant3.id, name: 'Pepperoni Pizza', description: 'Loaded with spicy pepperoni and cheese', price: 450, category: 'Pizza', isVeg: false },
      { restaurantId: restaurant3.id, name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce with grilled chicken', price: 480, category: 'Pizza', isVeg: false },
      { restaurantId: restaurant3.id, name: 'Garlic Bread', description: 'Toasted with garlic butter and herbs', price: 150, category: 'Sides', isVeg: true },
      { restaurantId: restaurant3.id, name: 'Caesar Salad', description: 'Romaine lettuce with parmesan and croutons', price: 220, category: 'Salads', isVeg: true },
      { restaurantId: restaurant3.id, name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 280, category: 'Dessert', isVeg: true },
    ],
  });

  // Menu items for Biryani House
  await prisma.menuItem.createMany({
    data: [
      { restaurantId: restaurant4.id, name: 'Hyderabadi Chicken Biryani', description: 'Authentic dum biryani with tender chicken', price: 320, category: 'Biryani', isVeg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
      { restaurantId: restaurant4.id, name: 'Mutton Biryani', description: 'Premium goat meat biryani', price: 420, category: 'Biryani', isVeg: false },
      { restaurantId: restaurant4.id, name: 'Veg Biryani', description: 'Mixed vegetables in fragrant rice', price: 250, category: 'Biryani', isVeg: true },
      { restaurantId: restaurant4.id, name: 'Chicken 65', description: 'Spicy deep-fried chicken', price: 220, category: 'Starters', isVeg: false },
      { restaurantId: restaurant4.id, name: 'Raita', description: 'Cooling yogurt with cucumber and mint', price: 60, category: 'Sides', isVeg: true },
      { restaurantId: restaurant4.id, name: 'Double Ka Meetha', description: 'Traditional Hyderabadi bread pudding', price: 150, category: 'Dessert', isVeg: true },
    ],
  });

  // Menu items for Burger Barn
  await prisma.menuItem.createMany({
    data: [
      { restaurantId: restaurant5.id, name: 'Classic Smash Burger', description: 'Double patty with cheese, lettuce, tomato', price: 280, category: 'Burgers', isVeg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
      { restaurantId: restaurant5.id, name: 'Veggie Burger', description: 'Crispy plant-based patty with avocado', price: 250, category: 'Burgers', isVeg: true },
      { restaurantId: restaurant5.id, name: 'Loaded Fries', description: 'Cheese, jalapenos, and sour cream', price: 180, category: 'Sides', isVeg: true },
      { restaurantId: restaurant5.id, name: 'Chicken Wings', description: 'Buffalo wings with ranch dip', price: 320, category: 'Sides', isVeg: false },
      { restaurantId: restaurant5.id, name: 'Milkshake', description: 'Thick creamy shake - chocolate/vanilla/strawberry', price: 160, category: 'Beverages', isVeg: true },
    ],
  });

  // Menu items for Dosa Factory
  await prisma.menuItem.createMany({
    data: [
      { restaurantId: restaurant6.id, name: 'Masala Dosa', description: 'Crispy crepe with spiced potato filling', price: 120, category: 'Dosa', isVeg: true, image: 'https://images.unsplash.com/photo-1668236543090-82eb5eace6fc?w=400' },
      { restaurantId: restaurant6.id, name: 'Mysore Masala Dosa', description: 'Dosa with red chutney and potato', price: 140, category: 'Dosa', isVeg: true },
      { restaurantId: restaurant6.id, name: 'Idli Sambar', description: 'Steamed rice cakes with lentil soup', price: 80, category: 'Breakfast', isVeg: true },
      { restaurantId: restaurant6.id, name: 'Medu Vada', description: 'Crispy lentil donuts with chutney', price: 90, category: 'Breakfast', isVeg: true },
      { restaurantId: restaurant6.id, name: 'Uttapam', description: 'Thick pancake with vegetables', price: 130, category: 'Breakfast', isVeg: true },
      { restaurantId: restaurant6.id, name: 'Filter Coffee', description: 'Traditional South Indian filter coffee', price: 50, category: 'Beverages', isVeg: true },
    ],
  });

  // Create sample reviews
  await prisma.review.createMany({
    data: [
      { userId: user.id, restaurantId: restaurant1.id, rating: 5, comment: 'Amazing butter chicken! Best in the city.' },
      { userId: user.id, restaurantId: restaurant3.id, rating: 4, comment: 'Great pizza, authentic Italian taste.' },
      { userId: user.id, restaurantId: restaurant4.id, rating: 5, comment: 'The biryani is heavenly! Must try.' },
    ],
  });

  // Create sample address
  await prisma.address.create({
    data: {
      userId: user.id,
      label: 'Home',
      address: '42 Elm Street, Apt 5B',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      isDefault: true,
    },
  });

  console.log('Database seeded successfully!');
  console.log('');
  console.log('Test Accounts:');
  console.log('  Admin:  admin@foodie.com / password123');
  console.log('  Owner:  rajesh@restaurant.com / password123');
  console.log('  Owner:  priya@restaurant.com / password123');
  console.log('  User:   john@user.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
