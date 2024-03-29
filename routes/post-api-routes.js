// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************
// Dependencies
// =============================================================
// Requiring our models
var db = require("../models");
var isAuthenticated = require("../config/middleware/isAuthenticated");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ dest: "images/" });
// Routes
// =============================================================
module.exports = function (app) {
  // GET route for getting all of the posts
  app.get("/api/posts", function (req, res) {
    var query = {};
    if (req.query.user_id) {
      query.UserId = req.query.user_id;
    }
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author
    db.Post.findAll({
      where: query,
      include: [db.User]
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  });
  // Get route for retrieving a single post
  app.get("/api/posts/:id", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author
    db.Post.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User]
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  });
  app.get("/api/posts/category/:category", function (req, res) {
    db.Post.findAll({
      where: {
        category: req.params.category
      },
      include: [db.User]
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  });
  app.get("/api/posts/user/:userid", function (req, res) {
    db.User.findOne({
      where: {
        user: req.params.userid
      }
    })
      .then(dbUser => {
        return db.Post.findAll({
          where: {
            UserId: dbUser.id
          },
          include: [db.User]
        });
      })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });
  // POST route for saving a new post
  app.post("/api/posts", isAuthenticated, upload.single('file'), function (req, res) {
    console.log(req.file);
    let photo;
    if (req.file) {
      photo = req.file.path
    }
    db.Post.create({ ...req.body, UserId: req.user.id, photo: photo }).then(function (dbPost) {
      res.json(dbPost);
    });
  });
  // DELETE route for deleting posts
  app.delete("/api/posts/:id", function (req, res) {
    db.Post.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  });
  // PUT route for updating posts
  app.put("/api/posts/:id", function (req, res) {
    db.Post.update(
        req.body,
        {
          where: {
            id: req.params.id
          },
          include: [db.User]
        }).then(function (dbPost) {
      res.json(dbPost);
    });
  });
  //Uploading photo
  app.post('/upload/photo', upload.single('file'), (req, res) => {
    // Define a JSONobject for the image attributes for saving to database
    console.log(req.file);
    res.send("Hello!")
  })
};



