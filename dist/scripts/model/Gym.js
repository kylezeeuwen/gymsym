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

      Gym.prototype.clientCount = function() {
        return this.clients.length;
      };

      Gym.prototype.advanceTime = function() {
        var client, i, len, newStatus, ref;
        this.time += 1;
        this.rack.advanceTime(this.time);
        ref = this.clients;
        for (i = 0, len = ref.length; i < len; i++) {
          client = ref[i];
          newStatus = client.advanceTime(this.time);
          if (newStatus === 'finished') {
            console.log('client finished');
            this.removeClient(client);
          }
        }
        return this.time;
      };

      Gym.prototype.dump = function() {
        var client, data, i, len, ref;
        data = {
          clients: [],
          rack: this.rack.dump(),
          time: this.time
        };
        ref = this.clients;
        for (i = 0, len = ref.length; i < len; i++) {
          client = ref[i];
          data.clients.push(client.dump());
        }
        return data;
      };

      Gym.prototype.listAllDumbells = function() {
        var client, data, dumbell, dumbells, hand, i, index, j, k, len, len1, len2, ref, ref1, ref2, slot;
        data = this.dump();
        dumbells = [];
        ref = this.clients;
        for (i = 0, len = ref.length; i < len; i++) {
          client = ref[i];
          ref1 = client.getDumbells();
          for (index = j = 0, len1 = ref1.length; j < len1; index = ++j) {
            dumbell = ref1[index];
            hand = dumbells.push({
              id: dumbell.id(),
              status: 'client',
              hand: index === 0 ? 'L' : 'R',
              client: client,
              dumbell: dumbell,
              weight: dumbell.props.weight
            });
          }
        }
        ref2 = data.rack;
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          slot = ref2[k];
          if (slot.dumbell) {
            dumbells.push({
              id: slot.dumbell.id(),
              status: 'rack',
              slotIndex: slot.index,
              dumbell: slot.dumbell,
              weight: slot.dumbell.props.weight
            });
          }
        }
        return dumbells;
      };

      return Gym;

    })();
    return Gym;
  });

}).call(this);
