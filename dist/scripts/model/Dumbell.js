(function() {
  angular.module('gymsym').factory('Dumbell', function() {
    var Dumbell;
    Dumbell = (function() {
      Dumbell.curMaxId = 0;

      Dumbell.getNewId = function() {
        this.curMaxId++;
        return this.curMaxId;
      };

      Dumbell.create = function(weight) {
        return new Dumbell(weight);
      };

      function Dumbell(weight) {
        this.props = {
          weight: weight
        };
        this.uniqId = Dumbell.getNewId();
      }

      Dumbell.prototype.id = function() {
        return this.uniqId;
      };

      Dumbell.prototype.weight = function() {
        return this.props.weight;
      };

      return Dumbell;

    })();
    return Dumbell;
  });

}).call(this);
