// Variables globales
process.env.DATABASE_URL = 'postgres://iihbagdlipnocu:EIgZe7oUnn3Mqk4F7RJpeixoS4@ec2-54-83-204-244.compute-1.amazonaws.com:5432/d5i57kjvaj1ttc?ssl=true';

// Requerir modelo de lista
var lista = require('./models/rutasLista');
var datos = require('./rutas.json');

lista.then(function(model){
  console.log('model',model); // LOG
  process.exit(1);
}, function(error) {
  console.log(error);
  process.exit(1);
});
