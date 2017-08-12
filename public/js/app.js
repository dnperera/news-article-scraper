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