const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user");

//Root route

router.get("/", function (req, res) {
  res.render("landing");
});

//Show Register Form

router.get("/register", function (req, res) {
  res.render("register");
});

//Handle Sign Up Logic

router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Welcome to Yelpcamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

//Show Login Form

router.get("/login", function (req, res) {
  res.render("login");
});

//handling login Logic

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

//logout Route

router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success","Logged you out!");
  res.redirect("/campgrounds");
});
module.exports = router;
