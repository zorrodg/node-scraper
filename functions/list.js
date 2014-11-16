var fs = require('fs'),
  purify = require('./purify'),
  diacritic = require('diacritic');

module.exports = function($, url){
  var todas = $('#cssmenu > ul > li'), 
    seccion, rutas, ruta, urlRuta, arrayFinal = [];

  for(var i = 0, len = todas.length; i < len; i++){
    seccion = $(todas[i]);
    rutas = seccion.find('ul > li');
    for(var j = 0, len2 = rutas.length; j < len2; j++){
      ruta = purify($(rutas[j]).html());
      urlRuta = ruta
        .toLowerCase()
        .replace(/[>.:]/g, '')
        .replace(' - ', ' ')
        .replace(' – ', '')
        .replace(/\s/g, '_');
      urlRuta = 'http://www.sitp.gov.co/publicaciones/' + diacritic.clean(urlRuta) + '_pub';
      arrayFinal.push(urlRuta);
    }
  }

  console.log(arrayFinal);
}