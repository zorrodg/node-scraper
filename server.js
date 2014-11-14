var server = require('express')(),
    request = require('request'),
    cheerio = require('cheerio'),
    Entities = require('html-entities').AllHtmlEntities,
    //diacritics = require('diacritics').remove,
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

function purify(node) {
  if(!node) return '';

  return entities.decode(node)
      .replace(/(<([^>]+)>)/ig, '')
      .replace(/(e|E)squema de ruta:/, '')
      .replace(/^\s*/g, '')
      .replace(/,\s+/g, ',')
      .replace(/\.(\.|\s)*?$/g, '');
}

function detail($, url){
  var esquemaRuta, ruta, titulo, id, horario, horas;

  ruta = $('h1.pub').html();
  esquemaRuta = $('#texto_principal')
    .children('table:first-child')
    .find('.azulBold').parent()
    .html();
  horario = $('#texto_principal')
    .children('table:last-child')
    .find('tr > td:last-child')
    .html();

  id = ruta.match(/\s([A-Z0-9]{1,5}):?\s/)[1];
  ruta = purify(ruta);
  esquemaRuta = purify(esquemaRuta).replace(/\sy\s/, ',').split(',');
  titulo = url.replace('http://www.sitp.gov.co/publicaciones/', '').replace('_pub', '').replace(':', '');
  horas = purify(horario).match(/([0-9]{1,2}:[0-9]{2} a?p?\.m\.?) a ([0-9]{1,2}:[0-9]{2} a?p?\.m\.?)/g);
  
  if(horas.length > 1){
    horario = {
      lun_sab: horas[0].replace(/\sa\s/, ' - ').replace(/\./g, ''),
      dom_fes: horas[1].replace(/\sa\s/, ' - ').replace(/\./g, '')
    }
  } else {
    horario = {
      lun_dom: horas[0].replace(/\sa\s/, ' - ').replace(/\./g, '')
    }
  }

  fs.writeFile('output/' + titulo + '.json', JSON.stringify({
    id: id,
    ruta: ruta,
    esquema: esquemaRuta,
    horario: horario
  }));
}

app = server.listen('3000');
console.log('Servidor iniciado en 3000');

scrape = require('./scrape.js')();

exports = module.exports = server;
