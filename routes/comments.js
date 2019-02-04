const express = require("express");
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

var router = express.Router({ mergeParams: true });

// ================================= \\
// ======|| COMMENTS ROUTES ||====== \\
// ================================= \\

// NEW - Show form to create a new comment
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

// CREATE - Add a new comment to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);

            req.flash("error", "Can't create the comment");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, newComment) => {
                if (err) {
                    console.log(err);
                } else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();

                    campground.comments.push(newComment);
                    campground.save();

                    req.flash("success", "Comment added");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// EDIT - Show form to update a specific comment
router.get("/:comment_id/edit", middleware.checkCommentdOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/edit", { comment: foundComment, campground_id: req.params.id });
        }
    });
});

// UPDATE - Update a specific comment
router.put("/:comment_id", middleware.checkCommentdOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            console.log(err);
            req.flash("error", "Can't create the comment");
        } else {
            req.flash("success", "Comment updated !");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE - Delete a specific comment
router.delete("/:comment_id", middleware.checkCommentdOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, err => {
        if (err) {
            console.log(err);
        }
        req.flash("success", "Comment deleted !");
        res.redirect("/campgrounds/" + req.params.id);
    });
});

module.exports = router;
