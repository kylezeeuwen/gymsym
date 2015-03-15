(function() {
  angular.module('gymsym').factory('BaseClient', function() {
    var BaseClient;
    BaseClient = (function() {
      BaseClient.create = function(id, name, program) {
        throw new Error("override in child class");
      };

      function BaseClient(uniqId, name, workoutPlan) {
        this.uniqId = uniqId;
        this.name = name;
        this.workoutPlan = this.validateWorkoutPlan(workoutPlan);
        this.xlastStatus = 'idle';
        this.status = 'idle';
        this.currentExercise = null;
        this.dumbells = [];
        this.time = 0;
      }

      BaseClient.prototype.advanceTime = function(time) {
        this.time = time;
        this.xlastStatus = this.status;
        switch (this.status) {
          case "idle":
            this.transitionsFromIdle();
            break;
          case "exercising":
            this.transitionsFromExercising();
            break;
          default:
            throw new Error("Invalid client state " + clientStatus + " for client " + client.name + " at time " + this.time);
        }
        return this.status;
      };

      BaseClient.prototype.transitionsFromIdle = function() {
        var dumbells, nextExercise, requiredWeights;
        nextExercise = this.getNextExercise();
        if (nextExercise) {
          requiredWeights = nextExercise.dumbells;
          if (this.rack.hasWeights(requiredWeights)) {
            dumbells = this.rack.takeDumbells(requiredWeights);
            this.startExercise(nextExercise, dumbells);
            return this.status = 'exercising';
          }
        } else {
          return this.status = 'finished';
        }
      };

      BaseClient.prototype.transitionsFromExercising = function(client) {
        if (this.currentExercise.startTime + this.currentExercise.duration < this.time) {
          this.finishExercise();
          return this.status = 'idle';
        }
      };

      BaseClient.prototype.getNextExercise = function() {
        return _.findWhere(this.workoutPlan, {
          status: 'pending'
        });
      };

      BaseClient.prototype.startWorkout = function(rack) {
        return this.rack = rack;
      };

      BaseClient.prototype.startExercise = function(exercise, dumbells) {
        this.currentExercise = this.workoutPlan[exercise.id];
        this.currentExercise.status = 'active';
        this.currentExercise.startTime = this.time;
        return this.dumbells = this.dumbells.concat(dumbells);
      };

      BaseClient.prototype.finishExercise = function() {
        this.currentExercise.status = 'complete';
        this.currentExercise.endTime = this.time;
        return this.returnDumbells();
      };

      BaseClient.prototype.returnDumbell = function(slot, dumbell) {
        return this.rack.putDumbell(slot, dumbell);
      };

      BaseClient.prototype.returnDumbells = function() {
        throw new Error("Override returndumbells() in child class");
      };

      BaseClient.prototype.validateWorkoutPlan = function(workoutPlan) {
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
          if (isNaN(ex.duration)) {
            throw new Error("" + place + " non-numeric duration");
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
            if (isNaN(ex.dumbells[wIndex])) {
              throw new Error("" + place + " non-numeric weight");
            }
          }
          ex.status = 'pending';
          ex.id = index;
        }
        return workoutPlan;
      };

      BaseClient.prototype.id = function() {
        return this.uniqId;
      };

      BaseClient.prototype.type = function() {
        if (!this.clientType) {
          throw new Error("must set type in child class");
        }
        return this.clientType;
      };

      BaseClient.prototype.dump = function() {
        return {
          id: this.id(),
          type: this.type(),
          name: this.name,
          status: this.status,
          dumbells: this.dumbells
        };
      };

      return BaseClient;

    })();
    return BaseClient;
  });

}).call(this);
