var page = require('webpage').create();
page.open('http://localhost:3000/scrape', function() {
  phantom.exit();
})
