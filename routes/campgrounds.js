const express = require("express")
const router = express.Router()
const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds.js")
const { isLoggedIn, isAutor, validateCampground } = require("../middleware.js")


router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(validateCampground, isLoggedIn, catchAsync(campgrounds.createNewCamp))

router.get("/new", isLoggedIn, campgrounds.renderNewForm)

router.get("/:id/edit", isLoggedIn, isAutor, catchAsync(campgrounds.renderEditForm));

router.route("/:id")
    .get(catchAsync(campgrounds.showCamp))
    .put(isLoggedIn, isAutor, validateCampground, catchAsync(campgrounds.updateCamp))
    .delete(isLoggedIn, isAutor, catchAsync(campgrounds.deleteCamp))

module.exports = router;