// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
const express = require("express");
const passport = require("./config/passport");
const session = require("express-session");
const logger = require("morgan");

// Sets up the Express App
// =============================================================
let app = express();
let PORT = process.env.PORT || 8080;

// Requiring our models for syncing
let db = require("./models");

app.use(logger("dev"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/images", express.static("images"));
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


// Routes
// =============================================================
require("./routes/html-routes.js")(app);
require("./routes/user-api-routes.js")(app);
require("./routes/post-api-routes.js")(app);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: false }).then(function () {
    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
        console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
});