import mongoose from 'mongoose';
import 'dotenv/config';
import Product from './models/Product.js';

const seedProducts = [
    // --- CROPS & VEGETABLES ---
    { name: "Miniket Rice", price: 72, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80" },
    { name: "Potato", price: 45, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=80" },
    { name: "Onion (Local)", price: 65, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=500&q=80" },
    { name: "Green Chili", price: 160, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=500&q=80" },
    { name: "Broccoli", price: 120, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=500&q=80" },
    { name: "Carrot", price: 60, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1598170845058-12ef4a457539?auto=format&fit=crop&w=500&q=80" },
    { name: "Soyabean Oil", price: 168, unit: "liter", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80" },
    { name: "Tomato", price: 90, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80" },
    { name: "Garlic", price: 210, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80" },
    { name: "Musur Dal (Lentil)", price: 140, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=500&q=80" },
    { name: "Ginger", price: 220, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80" },
    { name: "Eggplant (Brinjal)", price: 70, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1614735048999-52e46b9a89c9?auto=format&fit=crop&w=500&q=80" },
    { name: "Cabbage", price: 50, unit: "piece", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1596162954151-cd9a405908cd?auto=format&fit=crop&w=500&q=80" },
    { name: "Cauliflower", price: 60, unit: "piece", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1568584711270-38890db72bf2?auto=format&fit=crop&w=500&q=80" },
    { name: "Pumpkin", price: 40, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&w=500&q=80" },
    { name: "Spinach", price: 30, unit: "bundle", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=80" },
    { name: "Wheat Flour (Atta)", price: 55, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80" },
    { name: "Mustard Oil", price: 250, unit: "liter", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1620606994119-943926078c52?auto=format&fit=crop&w=500&q=80" },
    { name: "Cucumber", price: 50, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=500&q=80" },
    { name: "Lemon", price: 40, unit: "4 pcs", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1534531141161-e41d133a8979?auto=format&fit=crop&w=500&q=80" },
    { name: "Papaya", price: 45, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=500&q=80" },
    { name: "Capsicum", price: 180, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=500&q=80" },
    { name: "Sweet Potato", price: 65, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80" },
    { name: "Coriander Leaves", price: 120, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1588879460405-502685718a47?auto=format&fit=crop&w=500&q=80" },

    // --- POULTRY & MEAT ---
    { name: "Beef", price: 780, unit: "kg", dateUpdated: "September 26, 2026", category: "Poultry", imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=500&q=80" },
    { name: "Chicken Egg", price: 155, unit: "dozen", dateUpdated: "September 26, 2026", category: "Poultry", imageUrl: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=500&q=80" },
    { name: "Broiler Chicken", price: 175, unit: "kg", dateUpdated: "September 26, 2026", category: "Poultry", imageUrl: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=500&q=80" },
    { name: "Sonali Chicken", price: 320, unit: "kg", dateUpdated: "September 26, 2026", category: "Poultry", imageUrl: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=80" },
    { name: "Mutton", price: 1100, unit: "kg", dateUpdated: "September 26, 2026", category: "Poultry", imageUrl: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=500&q=80" },
    { name: "Duck Egg", price: 220, unit: "dozen", dateUpdated: "September 26, 2026", category: "Poultry", imageUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=500&q=80" },
    { name: "Deshi Chicken", price: 550, unit: "kg", dateUpdated: "September 26, 2026", category: "Poultry", imageUrl: "https://images.unsplash.com/photo-1518562306231-31ce7ea94511?auto=format&fit=crop&w=500&q=80" },

    // --- FISHERY PRODUCTS ---
    { name: "Hilsa Fish (Ilish)", price: 1400, unit: "kg", dateUpdated: "September 26, 2026", category: "Fishery Products", imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80" },
    { name: "Rui Fish", price: 380, unit: "kg", dateUpdated: "September 26, 2026", category: "Fishery Products", imageUrl: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=500&q=80" },
    { name: "Pangas Fish", price: 200, unit: "kg", dateUpdated: "September 26, 2026", category: "Fishery Products", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=500&q=80" },
    { name: "Tilapia", price: 220, unit: "kg", dateUpdated: "September 26, 2026", category: "Fishery Products", imageUrl: "https://images.unsplash.com/photo-1580479104037-975da604314c?auto=format&fit=crop&w=500&q=80" },
    { name: "Shrimp / Prawn", price: 850, unit: "kg", dateUpdated: "September 26, 2026", category: "Fishery Products", imageUrl: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=500&q=80" },
    { name: "Katla Fish", price: 400, unit: "kg", dateUpdated: "September 26, 2026", category: "Fishery Products", imageUrl: "https://images.unsplash.com/photo-1596797287955-442878496be6?auto=format&fit=crop&w=500&q=80" },
    { name: "Dry Fish (Shutki)", price: 900, unit: "kg", dateUpdated: "September 26, 2026", category: "Fishery Products", imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=500&q=80" },
    { name: "Watermelon", price: 40, unit: "kg", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1587049352847-81a56d773cae?auto=format&fit=crop&w=500&q=80" },
    { name: "Banana", price: 100, unit: "dozen", dateUpdated: "September 26, 2026", category: "Crops", imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80" }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Connected to MongoDB. Seeding products...");
        await Product.deleteMany({});
        await Product.insertMany(seedProducts);
        console.log("40 100% unique products seeded successfully!");
        mongoose.connection.close();
    })
    .catch(err => console.log(err));