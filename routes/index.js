const express = require("express");
const User = require("../models/user");
const passport = require("passport");
var router = express.Router();

// Root route
router.get("/", (req, res) => {
    res.render("landing");
});

// ===================================== \\
// ======|| AUTHENTICATE ROUTES ||====== \\
// ===================================== \\

// Show register form
router.get("/register", (req, res) => res.render("register"));

// Handle sign up logic
router.post("/register", (req, res) => {
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to Yelpcamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Show login form
router.get("/login", (req, res) => res.render("login"));

// Handle login logic
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    (req, res) => {}
);

// Handle logout logic
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;
