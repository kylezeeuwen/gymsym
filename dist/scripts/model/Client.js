(function() {
  angular.module('gymsym').factory('Client', function() {
    var Client;
    Client = (function() {
      Client.curMaxId = 0;

      Client.getNewId = function() {
        this.curMaxId++;
        return this.curMaxId;
      };

      Client.create = function(name, program) {
        return new Rack(name, program);
      };

      function Client(name, program) {
        this.props = {
          name: name,
          program: program
        };
        this.uniqId = Client.getNewId();
      }

      Client.prototype.id = function() {
        return this.uniqId;
      };

      return Client;

    })();
    return Client;
  });

}).call(this);
