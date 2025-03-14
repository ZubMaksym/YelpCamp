const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const expressError = require("./utils/ExpressError");
const ExpressError = require("./utils/ExpressError");
const { title } = require("process");

mongoose.connect("mongodb://localhost:27017/yelp-camp")
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get('/', (req, res) => {
    res.render("home");
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render("campgrounds/index", { camps });
}));

app.get("/campgrounds/new", (req, res) => {
    res.render('campgrounds/new');
})

app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/show", { camp });
}));

app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { camp });
}));

app.put("/campgrounds/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/campgrounds/${campground._id}`);
    // res.redirect(`/campgrounds`);
}));

app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}));

app.post("/campgrounds", catchAsync(async (req, res, next) => {
    // if(!req.body){
    //     throw new ExpressError("invalid Campground Data", 400);
    // }
    const campgroundScema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    })
    const {error} = campgroundScema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    const campground = await Campground.insertOne(req.body);
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.all("*", (req, res, next) => {
    next(new ExpressError('Page not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode= 500} = err;
    if(!err.message) err.message= "Oh no! Something went wrong :("
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log("LISTENING");
})