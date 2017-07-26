var express = require('express');
var app = express();
const hbs = require('express-handlebars');

app.use(express.static('public'));

app.engine('.hbs', hbs({
  defaultLayout: 'default',
  extname: '.hbs'
}));

app.set('view engine', '.hbs');

app.get('/', function(req, res){
  res.render('home');
});

app.get('/push', function(req, res){
  res.render('push');
})

app.listen(3000, function (err){
  if (err) return console.log('Hubo un error'),     process.exit(1);//Devolvemos un mensaje si existe algun error

  console.log('Escuchando en el puerto 3000');
});