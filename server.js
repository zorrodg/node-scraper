var server = require('express')(),
    request = require('request'),
    cheerio = require('cheerio'),
    detail = require('./functions/detail'),
    list = require('./functions/list');

server.get('/scrape/:type', function(req, res) {
  var url = req.param('url'),
    type = req.param('type');
  // URL to scrape
  if(!url) return res.send('No url');

  request({
    url:url,
    encoding: 'binary'
  }, function(error, response, html) {
    var $, promise;
    // Check for errors
    if(!error){
      $ = cheerio.load(html, {
        normalizeWhitespace: false,
        xmlMode: false,
        decodeEntities: true
      });

      switch(type){
        case 'list':
          promise = list($, url);
          break;
        case 'detail':
          promise = detail($, url);
          break;
      }

      promise.then(function(){
        res.send('Done');
      }, function(){
        res.send('Error');
      }); 
    }

  });
});

server.get('/end', function(req,res){
  res.send('Finish');
  return app && app.close();
});

server.listen('3000');
console.log('Servidor iniciado en 3000');

require('./scrape')();

exports = module.exports = server;
