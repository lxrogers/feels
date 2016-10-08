
sendMessage = function(path, opt_param) {
  if (opt_param) {
    path += '?c=' + opt_param.color;
    path += '&r=' + opt_param.reason;
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', path, true);
  xhr.send();
};

onOpened = function() {
  sendMessage('/opened');
};

sendFeel = function() {
  console.log("sending feel");
  sendMessage('/feel', {'color' : current_color, 'reason' : reasonBox.val()});
}

receiveFeel = function(m) {
  console.log("receive feel");
  var feel = JSON.parse(m.data);
  addParticle(feel.color, feel.reason);
};

openChannel = function(token) {
  console.log("openChannel", token)
  var channel = new goog.appengine.Channel(token);
  var handler = {
    'onopen': onOpened,
    'onmessage': receiveFeel,
    'onerror': function() {},
    'onclose': function() {}
  };
  var socket = channel.open(handler);
};

initialize = function(token) {
  console.log("initialize", token);
  openChannel(token);
};