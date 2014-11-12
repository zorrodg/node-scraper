var server = require('express')(),
    request = require('request'),
    cheerio = require('cheerio'),
    Entities = require('html-entities').AllHtmlEntities,
    entities = new Entities(),
    fs = require('fs');

server.get('/scrape', function(req, res) {
  // URL to scrape
  var url = req.query.url,
    $, esquemaRuta;

  if(!url) return res.send('No url');

  request(url, function(error, response, html) {
    // Check for errors
    if(!error){
      $ = cheerio.load(html, {
        normalizeWhitespace: false,
        xmlMode: false,
        decodeEntities: true
      });
      esquemaRuta = $('#texto_principal')
        .find('tr:last-child')
        .find('.azulBold').parent()
        .html();
    }

    esquemaRuta = entities.decode(esquemaRuta)
      .replace(/(<([^>]+)>)/ig, '')
      .replace('Esquema de ruta: ', '')
      .replace(/^\s*/g, '')
      .replace(/,\s+/g, ',')
      .replace(/.$/, '')
      .split(',');
      
    res.set({
      'Content-Type': 'application/json',
    });
    res.send(esquemaRuta);
  });
});

server.listen('3000');
console.log('Servidor iniciado en 3000');

exports = module.exports = server;
