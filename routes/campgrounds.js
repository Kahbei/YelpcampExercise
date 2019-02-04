const express = require("express");
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

var router = express.Router();

// =================================== \\
// ======|| CAMPGROUND ROUTES ||====== \\
// =================================== \\

// INDEX - Display all campgrounds
router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    });
});

// POST - Add a new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
    let newCampground = req.body.campground;
    newCampground.author = {
        id: req.user._id,
        username: req.user.username
    };

    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
            req.flash("error", "Can't create the campground");
        } else {
            req.flash("success", "Campground added");
            res.redirect("/campgrounds");
        }
    });
});

// NEW - Show form to create a new campground
router.get("/new", middleware.isLoggedIn, (req, res) => res.render("campgrounds/new"));

// SHOW -  Shows more info about a specific campground
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id)
        .populate("comments")
        .exec((err, campgroundFound) => {
            if (err) {
                console.log(err);
                req.flash("error", "Can't found the campground");
            } else {
                res.render("campgrounds/show", { campground: campgroundFound });
            }
        });
});

// EDIT - Show form to update a specific campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campgroundEdit) => {
        res.render("campgrounds/edit", { campground: campgroundEdit });
    });
});

// UPDATE - Update a specific campground
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            console.log(err);
            req.flash("error", "Can't update this campground");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground updated !");
            res.redirect("/campgrounds/" + updatedCampground._id);
        }
    });
});

// DELETE - Delete a specific campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
            req.flash("error", "Can't delete this campground");
        }
        Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, err => {
            if (err) {
                console.log(err);
            }
            req.flash("success", "Campground deleted !");
            res.redirect("/campgrounds");
        });
    });
});

module.exports = router;
