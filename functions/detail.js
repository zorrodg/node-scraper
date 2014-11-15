var fs = require('fs'),
  purify = require('./purify');

module.exports = function($, url){
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