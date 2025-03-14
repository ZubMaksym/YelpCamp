const mongoose = require("mongoose");
const cities = require("./cities")
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers")

mongoose.connect("mongodb://localhost:27017/yelp-camp")
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log("Database connected")
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]


const seedDB = async () => {
    await Campground.deleteMany({});
    const c = new Campground({ title: "purple field" });
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor((Math.random() * 20) + 10);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste impedit nisi accusantium? Error non quam porro, a voluptatum, sed autem excepturi, fugiat sequi dicta magni cum eaque dignissimos temporibus consectetur?",
            price: price,
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})