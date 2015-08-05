(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('gymsym').factory('AverageJoeClient', function(BaseClient) {
    var AverageJoeClient;
    AverageJoeClient = (function(superClass) {
      extend(AverageJoeClient, superClass);

      function AverageJoeClient() {
        return AverageJoeClient.__super__.constructor.apply(this, arguments);
      }

      AverageJoeClient.create = function(id, name, program) {
        return new AverageJoeClient(id, name, program);
      };

      AverageJoeClient.prototype.returnDumbells = function() {
        var availableCorrectSlots, availableSlots, dumbell, results;
        results = [];
        while (dumbell = this.dumbells.shift()) {
          availableCorrectSlots = this.rack.getEmptySlotsForDumbell(dumbell);
          availableSlots = this.rack.getEmptySlots();
          if (availableCorrectSlots.length > 0) {
            results.push(this.returnDumbell(availableCorrectSlots[0], dumbell));
          } else if (availableSlots.length > 0) {
            results.push(this.returnDumbell(availableSlots[0], dumbell));
          } else {
            throw new Error("Cannot return dumbell " + (dumbell.weight()) + ": rack is full");
          }
        }
        return results;
      };

      AverageJoeClient.prototype.clientType = 'AverageJoeClient';

      return AverageJoeClient;

    })(BaseClient);
    return AverageJoeClient;
  });

}).call(this);
