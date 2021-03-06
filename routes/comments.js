const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Comment = require("../models/comment"),
  Campground = require("../models/campground");
  middleware = require("../middleware");

//Comments New

router.get("/new", middleware.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

//Comments Create

router.post("/", middleware.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      req.flash("error","Something went Wrong");
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          //add username and id to the comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success","Successfully Added Comment!!!")
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});
//Comment Edit Route
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      res.render("back");
    } else {
      res.render("comments/edit", {
        campground_id: req.params.id,
        comment: foundComment,
      });
    }
  });
});

//Comment Update Route

router.put("/:comment_id",middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    function (err, UpdatedComment) {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});

//Comment destroy route

router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id,function(err){
    if(err){
      res.redirect("back");
    }else{
      req.flash("success", "Comment Deleted!!");
      res.redirect("/campgrounds/"+ req.params.id)
    }
  })
})


module.exports = router;
