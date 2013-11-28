/**
 * Main client side logic.
 */
(function() {
  var socket = io.connect();

  socket.on('status', function (data) {
    console.log(data);
  });

})();