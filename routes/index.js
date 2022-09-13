const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require('bcryptjs');
const { isAuthenticated, isNotAuthenticated } = require('../middlewares/auth.middleware');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/repeated", isNotAuthenticated,(req, res, next) => {
  res.render("repeated");
})

router.get("/signup", isNotAuthenticated, (req, res, next) => {
  res.render("signup");
})

router.post("/signup", (req,res,next) => {

  const thisUsername = req.body.username;
  // User.findOne({username: thisUsername})
  //     .then(found => {
  //       if(found) {
  //         res.redirect("repeated");
  //         return;
  //       }
  //       else {
  //         return;
  //       }
  //     })
  //     .catch(error => console.log(error));
  const thisPassword = req.body.password;


  const hashedPW = bcrypt.hashSync(thisPassword);

  User.create({
    username: thisUsername,
    password: hashedPW,
  })
  .then(savedUser => {
    console.log(savedUser);
    res.send(savedUser);
  })
  .catch(error => {
    console.log(error);
    res.send(error);
  })
})

router.get("/login", isNotAuthenticated, (req, res, next) => {
  res.render("login");
})

router.post("/login", (req, res, next) => {
  const thisUsername = req.body.username;
  const thisPassword = req.body.password;


  User.findOne({
    username: thisUsername,
  })
  .then(foundUser => {
    if(foundUser) {
      const samePW = bcrypt.compareSync(thisPassword, foundUser.password);
      if(samePW) {
        req.session.user = foundUser;
        res.redirect("/profile");
      }
      else {
        res.send("Incorrect password");
      }
    }
    else {
      res.send("No user for this username");
    }
  })
  .catch(error => {
    console.log(error);
    res.send(error);
  })
})

router.get("/main", isAuthenticated, (req, res, next) => {
  res.render("main")
})

router.get("/private", isAuthenticated, (req, res, next) => {
  res.render("private")
})

router.get("/profile", (req, res, next) => {
  if(req.session.user) {
    res.render("profile", {username: req.session.user.username});
  }
  else {
    res.render("profile", {username: "Stranger"})
  }
})

module.exports = router;
