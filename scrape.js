var pageList = require('./rutas.json'),
    localServer = 'http://localhost:3000/',
    request = require('request');

module.exports = function(){
  request(localServer + 'scrape/list?url=' + encodeURI('http://www.sitp.gov.co/publicaciones/rutas_del_servicio_urbano_pub'), 
    function(error, response, html) {
      var count = 0;
      if(!error && html === 'Done'){

        for(var i = 0, len = pageList.length; i < len; i++){
          request(localServer + 'scrape/detail?url=' + encodeURI(pageList[i]), function(e,r,html){
            count++;
            if(count === len){
              request(localServer + 'end');
            }
          });
        }
      }
    });
};

