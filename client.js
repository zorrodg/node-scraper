var pageList = require('./rutas.json'),
  request = require('request');

for(var i = 0, len = pageList.length; i < len; i++){
  console.log('Scraping ' + pageList[i]);
  request('http://localhost:3000/scrape?url=' + encodeURI(pageList[i]));
}

