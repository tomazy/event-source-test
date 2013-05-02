var express = require('express');
var app = express();
var eventInterval = 0; //ms

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
  app.use(function(err, req, res, next){
    console.log(err.stack);
    res.send(500, 'something broke!');
  });
});

app.get("/", function(req, res){
  res.redirect('/index.html');
});

app.get("/events", function(req, res){
  var intervalId,
    id = 0;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  intervalId = setInterval(function(){
    res.write('id:' + (id++) + '\n');
    res.write('event: data\n');
    res.write('data: ' + Math.random() + '\n\n');
  }, eventInterval);

  res.on('close', function(){
    console.log('connection closed');
    clearInterval(intervalId);
  });
});

app.listen(3000);
console.log('listening on port 3000');
