(function(){
  "use strict";

  var elStatus;
  var firstEventTime;
  var eventCounter = 0;

  function q(selector){
    return document.querySelector(selector);
  }

  function handleServerEvent(data){
    var time = Date.now(),
      eventsPerSec = 0,
      secs;

    eventCounter++;

    if (firstEventTime === undefined)
      firstEventTime = time;
    else {
      secs = (time - firstEventTime) / 1000;
      eventsPerSec = eventCounter / secs

      elStatus.innerHTML = eventCounter + " events in " + secs.toFixed(1) + "sec \n" +
        eventsPerSec.toFixed(2) + " events/sec";
    }
  }

  window.addEventListener('load', function(){
    elStatus = q('#status');

    var events = new EventSource('/events');
    events.addEventListener('data', function(e){
      handleServerEvent(e.data);
    });
  });
}());
