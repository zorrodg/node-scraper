var page = require('webpage').create();
page.open('http://localhost:3000/scrape?url=' + encodeURI('http://www.sitp.gov.co/publicaciones/ruta_56a_boita_teusaquillo_pub'), 
  function() {
    phantom.exit();
  });
