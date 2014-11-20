var pageList,
    localServer = 'http://localhost:3000/',
    request = require('request');

module.exports = function(){
  var count = 0, i, len;

  request(localServer + 'scrape/list?url=' + encodeURI('http://www.sitp.gov.co/publicaciones/rutas_del_servicio_urbano_pub'), 
    function(error, response, html) { 
      if(!error && html === 'Done'){
        pageList = require('./rutas.json');
        for(i = 0, len = pageList.length; i < len; i++){
          request(localServer + 'scrape/detail?url=' + encodeURI(pageList[i]), handleResponse);
        }
      }
    });

  function handleResponse(e,r,html){
    count++;
    if(count === len){
      return request(localServer + 'end');
    }
  }
};

