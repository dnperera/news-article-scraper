// Dependencies
var express = require("express");
var request = require("request");

var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var path = require("path");
var logger = require("morgan");
var mongoose = require("mongoose");

// Set up our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;
// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/scraping-mongoose";
// Connect mongoose to our database
mongoose.connect(db, function(error) {
  // Log any errors connecting with mongoose
  if (error) {
    console.log(error);
  }
  // Or log a success message
  else {
    console.log("mongoose connection is successful");
  }
});

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./controllers/newsController.js");

app.use("/", routes);

// Listen on the port
app.listen(PORT, function() {
  console.log("Listening on port:" + PORT);
});