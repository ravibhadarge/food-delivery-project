import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";
import userModel from "./models/userModel.js";
import bcrypt from "bcryptjs";

const seedData = [
    { name: "Greek Salad", description: "Food provides essential nutrients for overall health and well-being", price: 12, image: "1722865444288food_1.png", category: "Salad" },
    { name: "Veg Salad", description: "Food provides essential nutrients for overall health and well-being", price: 18, image: "1722865514626food_2.png", category: "Salad" },
    { name: "Clover Salad", description: "Food provides essential nutrients for overall health and well-being", price: 16, image: "1722865628915food_3.png", category: "Salad" },
    { name: "Chicken Salad", description: "Food provides essential nutrients for overall health and well-being", price: 24, image: "1722865668073food_4.png", category: "Salad" },
    { name: "Lasagna Rolls", description: "Food provides essential nutrients for overall health and well-being", price: 14, image: "1722865738489food_5.png", category: "Rolls" },
    { name: "Peri Peri Rolls", description: "Food provides essential nutrients for overall health and well-being", price: 12, image: "1722865934153food_6.png", category: "Rolls" },
    { name: "Chicken Rolls", description: "Food provides essential nutrients for overall health and well-being", price: 20, image: "1722865976487food_7.png", category: "Rolls" },
    { name: "Veg Rolls", description: "Food provides essential nutrients for overall health and well-being", price: 15, image: "1722866043779food_8.png", category: "Rolls" },
    { name: "Ripple Ice Cream", description: "Food provides essential nutrients for overall health and well-being", price: 14, image: "1722866109947food_9.png", category: "Deserts" },
    { name: "Fruit Ice Cream", description: "Food provides essential nutrients for overall health and well-being", price: 22, image: "1722866148130food_10.png", category: "Deserts" },
    { name: "Jar Ice Cream", description: "Food provides essential nutrients for overall health and well-being", price: 10, image: "1722866329894food_11.png", category: "Deserts" },
    { name: "Vanilla Ice Cream", description: "Food provides essential nutrients for overall health and well-being", price: 12, image: "1722866385025food_12.png", category: "Deserts" },
    { name: "Chicken Sandwich", description: "Food provides essential nutrients for overall health and well-being", price: 12, image: "1722866412882food_13.png", category: "Sandwich" },
    { name: "Vegan Sandwich", description: "Food provides essential nutrients for overall health and well-being", price: 18, image: "1722866469319food_14.png", category: "Sandwich" },
    { name: "Grilled Sandwich", description: "Food provides essential nutrients for overall health and well-being", price: 16, image: "1722866504992food_15.png", category: "Sandwich" },
    { name: "Bread Sandwich", description: "Food provides essential nutrients for overall health and well-being", price: 24, image: "1722866560218food_16.png", category: "Sandwich" },
    { name: "Cup Cake", description: "Food provides essential nutrients for overall health and well-being", price: 14, image: "1722866610567food_17.png", category: "Cake" },
    { name: "Vegan Cake", description: "Food provides essential nutrients for overall health and well-being", price: 12, image: "1722866647952food_18.png", category: "Cake" },
    { name: "Butterscotch Cake", description: "Food provides essential nutrients for overall health and well-being", price: 20, image: "1722866694357food_19.png", category: "Cake" },
    { name: "Sliced Cake", description: "Food provides essential nutrients for overall health and well-being", price: 15, image: "1722866729053food_20.png", category: "Cake" },
    { name: "Garlic Mushroom", description: "Food provides essential nutrients for overall health and well-being", price: 14, image: "1722866777756food_21.png", category: "Pure Veg" },
    { name: "Fried Cauliflower", description: "Food provides essential nutrients for overall health and well-being", price: 22, image: "1722866830901food_22.png", category: "Pure Veg" },
    { name: "Mix Veg Pulao", description: "Food provides essential nutrients for overall health and well-being", price: 10, image: "1722866871307food_23.png", category: "Pure Veg" },
    { name: "Rice Zucchini", description: "Food provides essential nutrients for overall health and well-being", price: 12, image: "1722866909328food_24.png", category: "Pure Veg" },
    { name: "Cheese Pasta", description: "Food provides essential nutrients for overall health and well-being", price: 12, image: "1722866948105food_25.png", category: "Pasta" },
    { name: "Tomato Pasta", description: "Food provides essential nutrients for overall health and well-being", price: 18, image: "1722867018540food_26.png", category: "Pasta" },
    { name: "Creamy Pasta", description: "Food provides essential nutrients for overall health and well-being", price: 16, image: "1722867053413food_27.png", category: "Pasta" },
    { name: "Chicken Pasta", description: "Food provides essential nutrients for overall health and well-being", price: 24, image: "1722867110108food_28.png", category: "Pasta" },
    { name: "Buttter Noodles", description: "Food provides essential nutrients for overall health and well-being", price: 14, image: "1722867144188food_29.png", category: "Noodles" },
    { name: "Veg Noodles", description: "Food provides essential nutrients for overall health and well-being", price: 12, image: "1722867222977food_30.png", category: "Noodles" },
    { name: "Somen Noodles", description: "Food provides essential nutrients for overall health and well-being", price: 20, image: "1722867254829food_31.png", category: "Noodles" },
    { name: "Cooked Noodles", description: "Food provides essential nutrients for overall health and well-being", price: 15, image: "1722867630288food_32.png", category: "Noodles" },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB Connected for seeding");

        // Seed food items (only if empty)
        const foodCount = await foodModel.countDocuments();
        if (foodCount === 0) {
            await foodModel.insertMany(seedData);
            console.log(`✅ Seeded ${seedData.length} food items`);
        } else {
            console.log(`⏭️  Food items already exist (${foodCount} items). Skipping seed.`);
        }

        // Seed admin user (only if no admin exists)
        const adminExists = await userModel.findOne({ role: "admin" });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await userModel.create({
                name: "Admin",
                email: "admin@food.com",
                password: hashedPassword,
                role: "admin",
                cartData: {},
            });
            console.log("✅ Admin user created: admin@food.com / admin123");
        } else {
            console.log(`⏭️  Admin user already exists (${adminExists.email}). Skipping.`);
        }

        await mongoose.disconnect();
        console.log("✅ Seed complete!");
    } catch (error) {
        console.error("❌ Seed error:", error.message);
        process.exit(1);
    }
};

seedDB();
