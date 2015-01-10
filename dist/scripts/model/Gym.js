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
        this.uniqId = Gym.getNewId();
      }

      Gym.prototype.id = function() {
        return this.uniqId;
      };

      Gym.prototype.addRack = function(rack) {
        return this.racks.push(rack);
      };

      Gym.prototype.dump = function() {
        var data, rack, _i, _len, _ref;
        data = {
          racks: []
        };
        _ref = this.racks;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          rack = _ref[_i];
          data.racks.push(rack.dump());
        }
        return data;
      };

      return Gym;

    })();
    return Gym;
  });

}).call(this);
