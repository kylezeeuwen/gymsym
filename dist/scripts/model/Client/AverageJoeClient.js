(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('gymsym').factory('AverageJoeClient', function(BaseClient) {
    var AverageJoeClient;
    AverageJoeClient = (function(_super) {
      __extends(AverageJoeClient, _super);

      function AverageJoeClient() {
        return AverageJoeClient.__super__.constructor.apply(this, arguments);
      }

      AverageJoeClient.create = function(id, name, program) {
        return new AverageJoeClient(id, name, program);
      };

      AverageJoeClient.prototype.returnDumbells = function() {
        var availableCorrectSlots, availableSlots, dumbell, _results;
        _results = [];
        while (dumbell = this.dumbells.shift()) {
          availableCorrectSlots = this.rack.getEmptySlotsForDumbell(dumbell);
          availableSlots = this.rack.getEmptySlots();
          if (availableCorrectSlots.length > 0) {
            _results.push(this.rack.putDumbell(availableCorrectSlots[0], dumbell));
          } else if (availableSlots.length > 0) {
            _results.push(this.rack.putDumbell(availableSlots[0], dumbell));
          } else {
            throw new Error("Cannot return dumbell " + (dumbell.weight()) + ": rack is full");
          }
        }
        return _results;
      };

      AverageJoeClient.prototype.clientType = 'AverageJoeClient';

      return AverageJoeClient;

    })(BaseClient);
    return AverageJoeClient;
  });

}).call(this);
