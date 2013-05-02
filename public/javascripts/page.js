(function(){
  "use strict";

  var elStatus;
  var elChart;
  var firstEventTime;
  var eventCounter = 0;
  var values = [];
  var numBars = 150;
  var elBars = [];
  var barHeight = 100;
  var barWidth = 10;

  function q(selector){
    return document.querySelector(selector);
  }

  function css(el, style){
    for (var key in style){
      el.style[key] = style[key]
    }
  }

  function ce(tagName){
    return document.createElement(tagName);
  }


  function initChart(){
    var elBar;

    css(elChart, {
      width: numBars * barWidth + 'px',
      height: barHeight + 'px'} );

    for (var i = 0; i < numBars; i++){
      values[i] = 0;

      elBar = elBars[i] = ce('div');
      elBar.className = 'bar';

      css(elBar, {
        left: i * barWidth + 'px',
        width: barWidth + 'px'
      });

      elChart.appendChild(elBar);
    }
  }

  function updateChart(val){
    var i;
    for (i = numBars - 1; i > 0; i--){
      values[i] = values[i - 1];
    }
    values[0] = val * barHeight;

    for (i = 0; i < numBars; i++){
      elBars[i].style.height = values[i] + "px";
    }
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

    updateChart(parseFloat(data));
  }

  window.addEventListener('load', function(){
    elStatus = q('#status');
    elChart = q('#chart');

    initChart();

    var events = new EventSource('/events');
    events.addEventListener('data', function(e){
      handleServerEvent(e.data);
    });
  });
}());
