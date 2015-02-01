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
        this.status = 'idle';
        this.currentExercise = null;
        this.dumbells = [];
      }

      Client.prototype.getNextExercise = function() {
        return _.findWhere(this.workoutPlan, {
          status: 'pending'
        });
      };

      Client.prototype.getCurrentExercise = function() {
        return this.currentExercise;
      };

      Client.prototype.startWorkout = function(startTime) {
        return this.startTime = startTime;
      };

      Client.prototype.finishWorkout = function(endTime) {
        this.endTime = endTime;
        return this.status = 'finished';
      };

      Client.prototype.startExercise = function(exercise, dumbell, startTime) {
        this.currentExercise = this.workoutPlan[exercise.id];
        this.currentExercise.status = 'active';
        this.currentExercise.startTime = startTime;
        this.status = 'exercising';
        return this.dumbells.push(dumbell);
      };

      Client.prototype.finishExercise = function(endTime) {
        this.currentExercise.status = 'complete';
        this.currentExercise.endTime = endTime;
        this.status = 'idle';
        return this.dumbells = [];
      };

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
          if (!('dumbells' in ex)) {
            throw new Error("" + place + " missing dumbells");
          }
          if (!(ex.dumbells instanceof Array)) {
            throw new Error("" + place + " dumbells must be array");
          }
          _ref = ex.dumbells;
          for (wIndex = _j = 0, _len1 = _ref.length; _j < _len1; wIndex = ++_j) {
            weight = _ref[wIndex];
            place = "workoutPlan[" + index + "].dumbells[" + wIndex + "]";
            ex.dumbells[wIndex] = parseInt(weight);
            if (!_.isNumber(ex.dumbells[wIndex])) {
              throw new Error("" + place + " invalid weight '" + ex.dumbells[wIndex] + "'");
            }
          }
          ex.status = 'pending';
          ex.id = index;
        }
        return workoutPlan;
      };

      Client.prototype.id = function() {
        return this.uniqId;
      };

      Client.prototype.dump = function() {
        return {
          name: this.name,
          status: this.status,
          dumbells: this.dumbells
        };
      };

      return Client;

    })();
    return Client;
  });

}).call(this);
