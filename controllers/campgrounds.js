const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
    const camps = await Campground.find({});
    res.render("campgrounds/index", { camps });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createNewCamp = async (req, res, next) => {
    const campground = new Campground(req.body);
    console.log(campground.author)
    campground.author = req.user._id;
    await campground.save()
    req.flash("success", "Successfully made a new campground!")
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCamp = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!camp) {
        req.flash("error", "Can't find that campground");
        res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { camp });
}

module.exports.renderEditForm = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) {
        req.flash("error", "Can't find that campground");
        res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { camp });
}

module.exports.updateCamp = async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, req.body);
    req.flash("success", "Successfully updated campground!")
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a campground!")
    res.redirect(`/campgrounds`);
}