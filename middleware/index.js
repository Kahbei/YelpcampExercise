const Campground = require("../models/campground");
const Comment = require("../models/comment");

module.exports = {
    // Vérifie si l'utilisateur est l'auteur du campground
    checkCampgroundOwnership: (req, res, next) => {
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, (err, campground) => {
                if (err) {
                    console.log(err);

                    req.flash("error", "We can't found the campground");
                    redirect("back");
                } else {
                    if (campground.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "You can't manage another campground entry than yours");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be logged in");
            res.redirect("back");
        }
    },

    // Vérifie si l'utilisateur est l'auteur du commentaire
    checkCommentdOwnership: (req, res, next) => {
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, (err, comment) => {
                if (err) {
                    console.log(err);

                    req.flash("error", "We can't found the ccomment");
                    redirect("back");
                } else {
                    if (comment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "You can't manage another comment entry than yours");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be logged in");
            res.redirect("back");
        }
    },

    // Vérifie si on est connecté
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You need to be logged in");
        res.redirect("/login");
    }
};
