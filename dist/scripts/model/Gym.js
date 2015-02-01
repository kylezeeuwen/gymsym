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
        this.racks = [];
        this.clients = [];
        this.time = 0;
        this.uniqId = Gym.getNewId();
      }

      Gym.prototype.id = function() {
        return this.uniqId;
      };

      Gym.prototype.addRack = function(rack) {
        return this.racks.push(rack);
      };

      Gym.prototype.addClient = function(client) {
        this.clients.push(client);
        return client.startWorkout(this.time);
      };

      Gym.prototype.removeClient = function(exitingClient) {
        exitingClient.finishWorkout(this.time);
        return this.clients = _.filter(this.clients, function(client) {
          return client.id() !== exitingClient.id();
        });
      };

      Gym.prototype.advanceTime = function() {
        var client, _i, _len, _ref;
        this.time += 1;
        _ref = this.clients;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          client = _ref[_i];
          this.updateClient(client);
        }
        console.log("Time " + this.time);
        console.log(this.dump());
        return console.log(JSON.stringify(this.dump().clients));
      };

      Gym.prototype.updateClient = function(client) {
        var clientStatus;
        clientStatus = client.status;
        switch (clientStatus) {
          case "idle":
            return this.idleCode(client);
          case "exercising":
            return this.exercisingCode(client);
          default:
            throw new Error("Invalid client state " + clientStatus + " for client " + client.name + " at time " + this.time);
        }
      };

      Gym.prototype.idleCode = function(client) {
        var dumbell, nextExercise, rack, requiredDumbells, _i, _len, _ref, _results;
        nextExercise = client.getNextExercise();
        if (nextExercise) {
          requiredDumbells = nextExercise.dumbells;
          _ref = this.racks;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            rack = _ref[_i];
            if (rack.hasWeight(requiredDumbells[0])) {
              dumbell = rack.takeFirstDumbellWithWeight(requiredDumbells[0]);
              _results.push(client.startExercise(nextExercise, dumbell, this.time));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        } else {
          return this.removeClient(client);
        }
      };

      Gym.prototype.exercisingCode = function(client) {
        var currentExercise;
        currentExercise = client.getCurrentExercise();
        if (currentExercise.startTime + currentExercise.duration < this.time) {
          return client.finishExercise(this.time);
        }
      };

      Gym.prototype.dump = function() {
        var client, data, rack, _i, _j, _len, _len1, _ref, _ref1;
        data = {
          racks: [],
          clients: []
        };
        _ref = this.racks;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          rack = _ref[_i];
          data.racks.push(rack.dump());
        }
        _ref1 = this.clients;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          client = _ref1[_j];
          data.clients.push(client.dump());
        }
        return data;
      };

      return Gym;

    })();
    return Gym;
  });

}).call(this);
