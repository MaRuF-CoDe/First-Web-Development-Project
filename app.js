const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  Campground = require("./models/campground"),
  methodOverride = require("method-override"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

  const port = process.env.PORT || 3000;
  
//requiring routes

(campgroundRoute = require("./routes/campgrounds")),
  (commentRoute = require("./routes/comments")),
  (indexRoute = require("./routes/index"));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//mongoose.connect("mongodb://localhost/yelp_camp_V11")
mongoose.connect("mongodb+srv://Maruf:maruf250@cluster0.zp1k8.mongodb.net/Data");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed database

//PASSPORT CONFIGURATION

app.use(
  require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");

  next();
});

app.use("/", indexRoute);
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/comments", commentRoute);

app.listen(port, function (req, res) {
  console.log("YelpCamp Server Started");
});
