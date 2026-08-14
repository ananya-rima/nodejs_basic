require("dotenv").config();

const connectDB = require("../config/db");
const Product = require("../models/product");

const products = [
  {
    productName: "Apple",
    productPrice: 120,
    image: "apple.jpg",
    desc: "Fresh and juicy red apple.",
  },
  {
    productName: "Banana",
    productPrice: 60,
    image: "banana.jpg",
    desc: "Sweet ripe bananas rich in potassium.",
  },
  {
    productName: "Orange",
    productPrice: 90,
    image: "orange.jpg",
    desc: "Fresh oranges full of vitamin C.",
  },
  {
    productName: "Mango",
    productPrice: 150,
    image: "mango.jpg",
    desc: "Delicious seasonal mangoes.",
  },
  {
    productName: "Milk",
    productPrice: 55,
    image: "milk.jpg",
    desc: "Fresh full cream milk.",
  },
  {
    productName: "Bread",
    productPrice: 40,
    image: "bread.jpg",
    desc: "Soft and fresh bakery bread.",
  },
  {
    productName: "Egg",
    productPrice: 8,
    image: "egg.jpg",
    desc: "Farm fresh chicken eggs.",
  },
  {
    productName: "Rice",
    productPrice: 70,
    image: "rice.jpg",
    desc: "Premium quality basmati rice.",
  },
  {
    productName: "Sugar",
    productPrice: 50,
    image: "sugar.jpg",
    desc: "Refined white sugar.",
  },
  {
    productName: "Tea",
    productPrice: 250,
    image: "tea.jpg",
    desc: "Premium Assam tea leaves.",
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("✅ Products Seeded Successfully");

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

seedProducts();