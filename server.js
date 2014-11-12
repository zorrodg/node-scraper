(function(){
  var server = require('express')(),
      request = require('request'),
      cheerio = require('cheerio'),
      //phantom = require('node-phantom'),
      fs = require('fs');

  server.get('/scrape', function(req, res) {
    // URL to scrape
    var url = 'http://www.sitp.gov.co/publicaciones/ruta_56a_boita_teusaquillo_pub',
      $, esquemaRuta;

    request(url, function(error, response, html) {
      // Check for errors
      if(!error){
        $ = cheerio.load(html, {
          normalizeWhitespace: false,
          xmlMode: false,
          decodeEntities: true
        });
        esquemaRuta = $('#texto_principal')
          .children('table:first-child')
          .children('tbody').children('tr:last-child')
          .find('.azulBold + span')
          .html();
      }

      res.send(esquemaRuta);
    });
  });

  server.listen('3000');
  console.log('Servidor iniciado en 3000');

  exports = module.exports = server;

})();