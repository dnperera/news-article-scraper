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

	//First Remove all previous Articles
	Article.remove({}, function(err,removed) {
		if(err){
			res.send(err);
		}
		else{
			console.log("Deleted...");
		}
	});

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

// Update the Save status of the selected article
router.put("/articles/:id", function(req, res) {
	// Use the article id to find and update it's note
	Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
	// Execute the above query
	.exec(function(err, doc) {
	  // Log any errors
	  if (err) {
	    console.log(err);
	  }
	  else {
	    console.log("Updated");
	    res.send(doc);
	  }
	}); 
});

// This will get the articles which saved by the user
router.get("/savedArticles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({"saved": true }, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
  		res.send(doc);
    }
  });
});

// Create a new note or replace an existing note
router.post("/savenote/:id", function(req, res) {
	console.log(req.params.id);
	console.log(req.body);

	var newNote = new Note(req.body);
	newNote.save(function(error, doc) {
	    console.log('Doc id  --',doc);
	  if(error){
	    res.send(error);
	  }
	  else{
	    Article.findOneAndUpdate({"_id": req.params.id}, { "note": doc._id })
	    .exec(function(err, doc) {
	      // Log any errors
	      if (err) {
	        console.log(err);
	      }
	      else {
	        // Or send the document to the browser
	        res.send(doc);
	      }
	    });
	  }
	});
});

// Grab an article by it's ObjectId
router.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.send(doc);
    }
  });
});

//Delete selected Note
router.delete("/note/:id", function(req, res) {

	Note.remove({"_id":req.params.id}, function(err,removed) {
		if(err){
			res.send(err);
		}
		else{
			console.log("Note Deleted...");
			res.send(removed);
		}
	});
});

//Delete selected Note
router.delete("/articles/:id", function(req, res) {

	Article.remove({"_id":req.params.id}, function(err,removed) {
		if(err){
			res.send(err);
		}
		else{
			console.log("Note Deleted...");
			res.send(removed);
		}
	});
});
// Export routes for server.js to use.
module.exports = router;