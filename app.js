var express = require('express');
var app = express();
var eventInterval = 0; //ms
var connections = [];
var eventId = 0;

function addConnection(res){
  connections.push(res);
}

function removeConnection(res){
  var idx = connections.indexOf(res);
  connections.splice(idx, 1);
}

function notifyConnections(data){
  var message = [
    'id:' + (eventId++),
    'event: data',
    'data: ' + data,
  ].join('\n') + '\n\n';

  connections.forEach(function(res){
    res.write(message);
  });
}

setInterval(function(){
  notifyConnections(Math.random());
}, eventInterval);

//----------------------------------------------------------------------------
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
  console.log('--- new connection from ' + req.ip);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  addConnection(res);

  res.on('close', function(){
    removeConnection(res);
    console.log('--- connection closed');
  });
});

app.listen(3000);
console.log('listening on port 3000');
