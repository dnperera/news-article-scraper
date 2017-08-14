$( document ).ready(function() {
	$("#notes").hide();
	// Whenever someone clicks a scrape buttone tag
	$("#scrapeArticles").on("click", function() {
		
		$.ajax({
	    method: "GET",
	    url: "/scrape"
	  });
	});


	$("#viewArticles").on("click", function() {
		
		location.reload();

	});


	$(".saveArticle").on("click", function() {
		
		var articleID= $(this).attr("data-id");

		$.ajax({
	    method: "PUT",
	    url: "/articles/" +articleID
	  });
		$(this).text("Article Saved");
		$(this).removeClass("btn-success");
		$(this).attr("class","btn btn-danger viewSavedArticle");
		$(this).prop('disabled', true);
	});


$("#savedArticles").on("click", function() {

	$("#notes").hide();
		$.ajax({
	    	method: "GET",
	    	url: "/savedArticles"
	})
	.done(function(data) {
		$("#articles").empty();
	  // Log the response
	  for (var i = 0; i < data.length; i++) {
	    // Display the apropos information on the page
	       $("#articles").append("<div class='panel panel-default'>"+
          "<div class='panel-heading'>"+data[i].title+"</div>"+
          "<div class='panel-body'><div class='row'><div class='col-sm-6'><img class='img-thumbnail img-responsive' src='"+data[i].link
          +"'></div>"+
          "<div class='col-sm-6'>"+data[i].teaser+"<p></p>"+
          "<p><button type='button' onclick=showNoteBox('"+data[i]._id+"') article-id='"+data[i]._id+"'class='btn btn-success articleNotes'>Article Notes</button>"+
          "<button type='button' data='"+data[i]._id+"'class='btn btn-danger deleteArticle'>Delete</button></p>"+
          "</div>"+
          "</div></div>"+
          "</div>");
	  }

	});

	});
});

function showNoteBox(id) {
	$(document).find("#articleID").val(id);
	$("#notes").show();
	// Now make an ajax call for the Article
	$.ajax({
	  method: "GET",
	  url: "/articles/" + id
	})
	.done(function(data) {
		//console.log(data.note.note);

		if(data.note){
			//empty previous note box content
			$("#notes").empty();
			console.log(data.note);
			// displah existing note
			$("#notes").append("<div class='panel panel-info'>"+
			"<div class='panel-heading'>Your Note</div>"+
			"<div class='panel-body'>"+
			"<div class='row'>"+
			"<div class='col-sm-10'>"+data.note.note+"</div>"+
			"<div class='col-sm-2'>"+
            "<button type='button' data ='"+data.note._id+"' class='btn btn-danger deleteNote'>X</button>"+
            "</div></div>"+
			"</div></div>");				
		}
		else{
			$("#notes").empty();
			$("#notes").append("<div class='panel panel-info'>"+
			"<div class='panel-heading'>Create Your Note</div>"+
			"<div class='panel-body'>"+
			"<div class='row'>"+
			"<div class='col-sm-10'><input type='hidden' id='articleID' value='"+data._id+"' name='articleID'>"+
			"<textarea class='form-control' name='note' id='newNote'></textarea></div>"+
			"<div class='col-sm-2'>"+
            "</div></div>"+
            "<div class='row'>"+
            "<button type='button' id='saveSelectedNote' class='btn btn-success center-block'>Save</button></div>"+
			"</div></div>");
		}

	});
}

// When you click the delete button
$(document).on("click", ".deleteNote", function() {
	var noteID = $(document).find(".deleteNote").attr("data");
	// Run a POST request to change the note, using what's entered in the inputs
	$.ajax({
	  method: "DELETE",
	  url: "/note/" + noteID,
	})
		// With that done
	  .done(function(data) {
	  	console.log(data);
	  	$("#notes").empty();
	  });
});

// Delete article
$(document).on("click", ".deleteArticle", function() {
	
	var id = $(document).find(".deleteArticle").attr("data");

	$.ajax({
	  method: "DELETE",
	  url: "/articles/" + id,
	})
		// With that done
	  .done(function(data) {
	  	console.log(data);
	  	location.reload();
	  });
});

// When you click the savenote button
$(document).on("click", "#saveSelectedNote", function() {
	var thisID =$("#articleID").val();
	// Run a POST request to change the note, using what's entered in the inputs
	$.ajax({
	  method: "POST",
	  url: "/savenote/" + thisID,
	  data: {
	    // Value taken from note textarea
	    note: $("#newNote").val().trim()
	  }
	})
	  // With that done
	  .done(function(data) {
	    // Log the response
	    console.log(data);
	    // Empty the notes section
	    $("#newNote").val("");
	    $("#articleID").val("");
	    $("#notes").hide();
	  });

});
