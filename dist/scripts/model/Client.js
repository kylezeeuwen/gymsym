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
        return new Client(name, program);
      };

      function Client(name, workoutPlan) {
        this.name = name;
        this.workoutPlan = this.validateWorkoutPlan(workoutPlan);
        this.uniqId = Client.getNewId();
      }

      Client.prototype.validateWorkoutPlan = function(workoutPlan) {
        var ex, index, place, wIndex, weight, _i, _j, _len, _len1, _ref;
        if (!(workoutPlan instanceof Array)) {
          throw new Error('workoutPlan must be array');
        }
        for (index = _i = 0, _len = workoutPlan.length; _i < _len; index = ++_i) {
          ex = workoutPlan[index];
          place = "workoutPlan[" + index + "]";
          if (!('name' in ex)) {
            throw new Error("" + place + " missing name");
          }
          if (!('duration' in ex)) {
            throw new Error("" + place + " missing duration");
          }
          ex.duration = parseInt(ex.duration);
          if (!_.isNumber(ex.duration)) {
            throw new Error("" + place + " invalid duraiton '" + ex.duration + "'");
          }
          if (!('weights' in ex)) {
            throw new Error("" + place + " missing weights");
          }
          if (!(ex.weights instanceof Array)) {
            throw new Error("" + place + " weights must be array");
          }
          _ref = ex.weights;
          for (wIndex = _j = 0, _len1 = _ref.length; _j < _len1; wIndex = ++_j) {
            weight = _ref[wIndex];
            place = "workoutPlan[" + index + "].weights[" + wIndex + "]";
            ex.weights[wIndex] = parseInt(weight);
            if (!_.isNumber(ex.weights[wIndex])) {
              throw new Error("" + place + " invalid weight '" + ex.weights[wIndex] + "'");
            }
          }
          ex.status = 'pending';
        }
        return workoutPlan;
      };

      Client.prototype.id = function() {
        return this.uniqId;
      };

      return Client;

    })();
    return Client;
  });

}).call(this);
