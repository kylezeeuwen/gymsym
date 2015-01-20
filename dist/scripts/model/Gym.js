(function() {
  angular.module('gymsym').factory('Gym', function() {
    var Gym;
    Gym = (function() {
      Gym.curMaxId = 0;

      Gym.getNewId = function() {
        this.curMaxId++;
        return this.curMaxId;
      };

      Gym.create = function() {
        return new Gym();
      };

      function Gym() {
        this.rack = null;
        this.clients = [];
        this.time = 0;
        this.uniqId = Gym.getNewId();
      }

      Gym.prototype.id = function() {
        return this.uniqId;
      };

      Gym.prototype.setRack = function(rack) {
        return this.rack = rack;
      };

      Gym.prototype.addClient = function(client) {
        this.clients.push(client);
        return client.startWorkout(this.rack);
      };

      Gym.prototype.removeClient = function(exitingClient) {
        return this.clients = _.filter(this.clients, function(client) {
          return client.id() !== exitingClient.id();
        });
      };

      Gym.prototype.advanceTime = function() {
        var client, newStatus, _i, _len, _ref, _results;
        this.time += 1;
        _ref = this.clients;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          client = _ref[_i];
          newStatus = client.advanceTime(this.time);
          if (newStatus === 'finished') {
            _results.push(this.removeClient(client));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      Gym.prototype.dump = function() {
        var client, data, _i, _len, _ref;
        data = {
          clients: [],
          rack: this.rack.dump(),
          time: this.time
        };
        _ref = this.clients;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          client = _ref[_i];
          data.clients.push(client.dump());
        }
        return data;
      };

      return Gym;

    })();
    return Gym;
  });

}).call(this);
