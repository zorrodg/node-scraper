var server = require('express')(),
    request = require('request'),
    cheerio = require('cheerio'),
    detail = require('./functions/detail'),
    list = require('./functions/list'),
    app;

server.get('/scrape/:type', function(req, res) {
  var url = req.param('url'),
    type = req.param('type');
  // URL to scrape
  if(!url) return res.send('No url');

  request(url, function(error, response, html) {
    var $;
    // Check for errors
    if(!error){
      $ = cheerio.load(html, {
        normalizeWhitespace: false,
        xmlMode: false,
        decodeEntities: true
      });

      switch(type){
        case 'list':
          list($, url);
          break;
        case 'detail':
          detail($, url);
          break;
      }

      res.send('Done');
    }

  });
});

server.get('/end', function(req,res){
  res.send('Finish');
  app && app.close();
});

app = server.listen('3000');
console.log('Servidor iniciado en 3000');

require('./scrape')();

exports = module.exports = server;
