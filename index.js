(function(){
  var server = require('express')(),
      request = require('request'),
      cheerio = require('cheerio'),
      fs = require('fs');

  server.get('/scrape', function(req, res) {
    // URL to scrape
    var url = 'http://www.sitp.gov.co/publicaciones/ruta_56a_boita_teusaquillo_pub',
      $;

    request(url, function(error, response, html) {
      // Check for errors
      if(!error){
        $ = cheerio.load(html);
        console.log($('#texto_principal')
          .children('table:first-child')
          .children('tr:last-child')
          .children('.azulBold').html());
      }
    });
  });

  server.listen('3000');
  console.log('Servidor iniciado en 3000');

  exports = module.exports = server;

})();