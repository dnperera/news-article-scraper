var express = require("express");
var request = require("request");
var cheerio = require("cheerio");


// Requiring our Note and Article models
var Article = require("../models/Article.js");
var Note = require("../models/Note.js");


var router = express.Router();
var latestNews =[];

// // Create all our routes and set up logic within those routes where required.
// router.get("/", function(req, res) {
// 	var hbsObject = {};
//   	res.render("index", hbsObject);
// });

// A GET request to scrape the npr website
router.get("/scrape", function(req, res) {
	console.log("Scrape request received ----");
	
	// First, we grab the body of the html with request
	request("http://www.npr.org/sections/news/", function(error, response, html) {
	// Then, we load that into cheerio and save it to $ for a shorthand selector
	var $ = cheerio.load(html);	
	// Now, we grab every h2 within an article tag, and do the following:
		$(".item.has-image").each(function(i, element) {
			var result = {};

			// // Add the text and href of every link, and save them as properties of the result object
			result.title = $(element).find(".item-info").find("h2").text();
			result.teaser = $(element).find(".item-info").find("p").text();
			result.link = $(element).find("a").find("img").attr("src");
			
			// // Using our Article model, create a new entry
			// This effectively passes the result object to the entry (and the title and link)
			
			var entry = new Article(result);

			// // Now, save that entry to the db
			entry.save(function(err, doc) {
			  // Log any errors
			  if (err) {
			    console.log(err);
			  }
			  // Or log the doc
			  else {
			  	latestNews.push(doc);
 
			  }
			});
		});		
	});

});

router.get("/", function(req, res) {
		console.log("Inside Server Side");

	// Finish the route so it grabs all of the articles
	Article.find({},function (error,doc){
	  if(error){
	    //send any errors to the browser
	    res.send(error);
	  }
	  else {
	    //send search results "doc" to the browser
	    //res.send(doc)
	    console.log(doc);

	   var hbsObject = {};
	   hbsObject.newsHeadlines = doc;

  		res.render("index", hbsObject);
	  }
	});

});

// Export routes for server.js to use.
module.exports = router;