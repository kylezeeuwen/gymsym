(function() {
  angular.module('gymsym').factory('Client', function(AverageJoeClient, RandomClient) {
    var Client;
    Client = (function() {
      function Client() {}

      Client.curMaxId = -1;

      Client.getNewId = function() {
        this.curMaxId++;
        return this.curMaxId;
      };

      Client.getClientClass = function(type) {
        var clientClass, types;
        types = {
          AverageJoe: AverageJoeClient,
          Random: RandomClient
        };
        clientClass = types[type];
        if (!clientClass) {
          throw new Error("Invalid client type " + type);
        }
        return clientClass;
      };

      Client.create = function(name, type, program) {
        var newId;
        newId = Client.getNewId();
        return Client.getClientClass(type).create(newId, name, program);
      };

      return Client;

    })();
    return Client;
  });

}).call(this);
