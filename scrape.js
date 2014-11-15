var pageList = require('./rutas.json'),
    localServer = 'http://localhost:3000/',
    request = require('request');

module.exports = function(){
  request(localServer + 'scrape/list?url=' + encodeURI('http://www.sitp.gov.co/publicaciones/rutas_del_servicio_urbano_pub'), 
    function(error, response, html) {
      if(!error){
        // for(var i = 0, len = pageList.length; i < len; i++){
        //   console.log('Scraping ' + pageList[i]);
        //   request(localServer + 'scrape/detail/' + encodeURI(pageList[i]));
        // }

        // request(localServer + 'end');
      }
    });
}

