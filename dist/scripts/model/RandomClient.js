(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('gymsym').factory('RandomClient', function(Client) {
    var RandomClient;
    RandomClient = (function(_super) {
      __extends(RandomClient, _super);

      function RandomClient() {
        return RandomClient.__super__.constructor.apply(this, arguments);
      }

      RandomClient.create = function(name, program) {
        return new RandomClient(name, program);
      };

      RandomClient.prototype.returnDumbells = function() {
        var availableSlots, dumbell, pick, _results;
        _results = [];
        while (dumbell = this.dumbells.shift()) {
          availableSlots = this.rack.getEmptySlots();
          if (availableSlots.length > 0) {
            pick = Math.floor(Math.random() * availableSlots.length);
            _results.push(this.rack.putDumbell(availableSlots[pick], dumbell));
          } else {
            throw new Error("Cannot return dumbell " + dumbell + ": rack is full");
          }
        }
        return _results;
      };

      RandomClient.prototype.type = function() {
        return 'RandomClient';
      };

      return RandomClient;

    })(Client);
    return RandomClient;
  });

}).call(this);
