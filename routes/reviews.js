const express = require("express");
router = express.Router({mergeParams: true})
const catchAsync = require("../utils/catchAsync");
const {validateReview, isLoggedIn, isReviewAutor} = require("../middleware.js")
const reviews = require("../controllers/reviews.js")

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAutor, catchAsync(reviews.deleteReview))

module.exports = router;