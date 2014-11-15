var fs = require('fs'),
  purify = require('./purify');

module.exports = function($, url){
  var todas = $('#cssmenu > ul > li'), seccion, rutas, ruta;

  for(var i = 0, len = todas.length; i < len; i++){
    seccion = $(todas[i]);
    rutas = seccion.find('ul > li');
    for(var j = 0, len2 = rutas.length; j < len2; j++){
      ruta = $(rutas[j]);
      console.log(purify(ruta.html()));
    }
  }
}