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
  if(!node) return '';

  return entities.decode(node)
      .replace(/(<([^>]+)>)/ig, '')
      .replace(/(e|E)squema de ruta:/, '')
      .replace(/^\s*/g, '')
      .replace(/,\s+/g, ',')
      .replace(/\.\s?$/, '');
}

function detail($){
  var esquemaRuta, ruta, titulo, id, horario, horas;

  ruta = $('h1.pub').text();
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
  esquemaRuta = purify(esquemaRuta).split(',');
  titulo = ruta.toLowerCase().replace('-', '').replace(/\s+/g, '_');
  horas = purify(horario).match(/([0-9]{1,2}:[0-9]{2} a?p?\.m\.?) a ([0-9]{1,2}:[0-9]{2} a?p?\.m\.?)/g);
  
  if(horas.length > 1){
    horario = {
      lun_sab: horas[0].replace(/\sa\s/, ' - '),
      dom_fes: horas[1].replace(/\sa\s/, ' - ')
    }
  } else {
    horario = {
      lun_dom: horas[0].replace(/\sa\s/, ' - ')
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
