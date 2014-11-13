var server = require('express')(),
    request = require('request'),
    cheerio = require('cheerio'),
    Entities = require('html-entities').AllHtmlEntities,
    entities = new Entities(),
    fs = require('fs');

server.get('/scrape', function(req, res) {
  // URL to scrape
  var url = req.query.url,
    $, esquemaRuta, ruta, titulo;

  if(!url) return res.send('No url');

  request(url, function(error, response, html) {
    // Check for errors
    if(!error){
      $ = cheerio.load(html, {
        normalizeWhitespace: false,
        xmlMode: false,
        decodeEntities: true
      });
      ruta = $('h1.pub').text();

      esquemaRuta = $('#texto_principal')
        .find('tr:last-child')
        .find('.azulBold').parent()
        .html();
    }

    esquemaRuta = purify(esquemaRuta);
    titulo = ruta.toLowerCase().replace('-', '').replace(/\s+/g, '_');

    console.log(ruta);
    
    fs.writeFile('output/' + titulo + '.json', JSON.stringify({
      ruta: ruta,
      esquema: esquemaRuta
    }));
    res.send(esquemaRuta);
  });
});

function purify(node) {
  return entities.decode(node)
      .replace(/(<([^>]+)>)/ig, '')
      .replace('Esquema de ruta: ', '')
      .replace(/^\s*/g, '')
      .replace(/,\s+/g, ',')
      .replace(/.$/, '')
      .split(',');
}

server.listen('3000');
console.log('Servidor iniciado en 3000');

exports = module.exports = server;
