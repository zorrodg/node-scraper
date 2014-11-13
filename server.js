var server = require('express')(),
    request = require('request'),
    cheerio = require('cheerio'),
    Entities = require('html-entities').AllHtmlEntities,
    entities = new Entities(),
    fs = require('fs'),
    app,
    scrape;

server.get('/scrape', function(req, res) {
  // URL to scrape
  var url = req.query.url,
    type = req.query.type;

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
        case 'detail':
          detail($);
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

function purify(node) {
  return entities.decode(node)
      .replace(/(<([^>]+)>)/ig, '')
      .replace('Esquema de ruta: ', '')
      .replace(/^\s*/g, '')
      .replace(/,\s+/g, ',')
      .replace(/\.$/, '');
}

function detail($){
  var esquemaRuta, ruta, titulo;

  ruta = $('h1.pub').text();
  esquemaRuta = $('#texto_principal')
    .find('tr:last-child')
    .find('.azulBold').parent()
    .html();

  ruta = purify(ruta);
  esquemaRuta = purify(esquemaRuta).split(',');
  titulo = ruta.toLowerCase().replace('-', '').replace(/\s+/g, '_');
  
  fs.writeFile('output/' + titulo + '.json', JSON.stringify({
    ruta: ruta,
    esquema: esquemaRuta
  }));
}

app = server.listen('3000');
console.log('Servidor iniciado en 3000');

scrape = require('./scrape.js')();

exports = module.exports = server;
