/**
 * Lista de rutas del SITP
 * @package nodescraper
 * @author Andrés Zorro <zorrodg@gmail.com>
 * @module model
 */

// Module dependencies
var orm = require('orm'),
    Q = require('q'),
    qOrm = require('q-orm');

var q = Q.defer();

qOrm.qConnect(process.env.DATABASE_URL)
  .then(function(db){

    // var sync = new Sync({
    //   dialect:'postgresql',
    //   driver: db.driver,
    //   debug: function(text) {
    //     console.log('> %s', text);
    //   }
    // });

    var collectionName = "rutas_lista";

    var collection = {
      nombre    : { type: "text", required: true },
      url       : { type: "text", required: true },
      id_ruta   : { type: "text", required: true },
      esquema   : { type: "enum" },
      horario   : { type: "json" }
    };

    // // Define tabla en la base de datos
    // sync.defineCollection(collectionName, collection);

    // Define modelo
    var Lista = db.qDefine(collectionName, 
      collection, 
      {
        methods: {}, 
        validations: {}
      }
    );

    Lista.sync(function(err){
      if(err) return console.log('err',err); // LOG

      return console.log('Synced');
    });

    return q.resolve(Lista);
    
  }, function(err){
    console.log('ORM Connection error', err); // LOG
    return false;
  });

module.exports = q.promise;
