(function() {
  angular.module('gymsym').factory('BaseClient', function() {
    var BaseClient;
    BaseClient = (function() {
      BaseClient.create = function(id, name, program) {
        throw new Error("override in child class");
      };

      function BaseClient(uniqId, name1, workoutPlan) {
        this.uniqId = uniqId;
        this.name = name1;
        this.workoutPlan = this.validateWorkoutPlan(workoutPlan);
        this.status = 'idle';
        this.currentExercise = null;
        this.dumbells = [];
        this.time = 0;
        this.restDuration = 7;
        this.restTimer = this.restDuration;
      }

      BaseClient.prototype.cornyMotion = function(time) {
        var flipped, getStretchedPosition, halfLife, index, percentage, stretchedPosition;
        halfLife = 4;
        if (!(halfLife > 2 && halfLife % 2 === 0)) {
          throw new Error("invalid halfLife " + {
            halfLife: halfLife
          } + ", must be even and > 2.");
        }
        stretchedPosition = {
          L: {
            x: -0.5,
            y: -0.5
          },
          R: {
            x: 0.5,
            y: -0.5
          }
        };
        getStretchedPosition = function(percentage) {
          return {
            L: {
              x: percentage * stretchedPosition['L']['x'],
              y: percentage * stretchedPosition['L']['y']
            },
            R: {
              x: percentage * stretchedPosition['R']['x'],
              y: percentage * stretchedPosition['R']['y']
            }
          };
        };
        index = time % (2 * halfLife);
        if (index < halfLife) {
          percentage = index / (halfLife - 1);
          return getStretchedPosition(percentage);
        } else {
          flipped = (2 * halfLife) - 1 - index;
          percentage = flipped / (halfLife - 1);
          return getStretchedPosition(percentage);
        }
      };

      BaseClient.prototype.advanceTime = function(time) {
        this.time = time;
        switch (this.status) {
          case 'idle':
            this.transitionsFromIdle();
            break;
          case 'waiting':
            this.transitionsFromIdle();
            break;
          case 'exercising':
            this.transitionsFromExercising();
            break;
          default:
            throw new Error("Invalid client state " + clientStatus + " for client " + client.name + " at time " + this.time);
        }
        return this.status;
      };

      BaseClient.prototype.transitionsFromIdle = function() {
        var dumbells, nextExercise, requiredWeights;
        this.restTimer++;
        if (this.restTimer < this.restDuration) {
          return;
        }
        nextExercise = this.getNextExercise();
        if (nextExercise) {
          requiredWeights = nextExercise.dumbells;
          if (this.rack.hasWeights(requiredWeights)) {
            dumbells = this.rack.takeDumbells(requiredWeights);
            this.startExercise(nextExercise, dumbells);
            return this.status = 'exercising';
          } else {
            return this.status = 'waiting';
          }
        } else {
          return this.status = 'finished';
        }
      };

      BaseClient.prototype.transitionsFromExercising = function(client) {
        if (this.currentExercise.startTime + this.currentExercise.duration < this.time) {
          this.finishExercise();
          this.status = 'idle';
          return this.restTimer = 0;
        }
      };

      BaseClient.prototype.getDumbells = function() {
        return this.dumbells;
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
        var ex, i, index, j, len, len1, place, ref, wIndex, weight;
        if (!(workoutPlan instanceof Array)) {
          throw new Error('workoutPlan must be array');
        }
        for (index = i = 0, len = workoutPlan.length; i < len; index = ++i) {
          ex = workoutPlan[index];
          place = "workoutPlan[" + index + "]";
          if (!('name' in ex)) {
            throw new Error(place + " missing name");
          }
          if (!('duration' in ex)) {
            throw new Error(place + " missing duration");
          }
          ex.duration = parseInt(ex.duration);
          if (isNaN(ex.duration)) {
            throw new Error(place + " non-numeric duration");
          }
          if (!('dumbells' in ex)) {
            throw new Error(place + " missing dumbells");
          }
          if (!(ex.dumbells instanceof Array)) {
            throw new Error(place + " dumbells must be array");
          }
          ref = ex.dumbells;
          for (wIndex = j = 0, len1 = ref.length; j < len1; wIndex = ++j) {
            weight = ref[wIndex];
            place = "workoutPlan[" + index + "].dumbells[" + wIndex + "]";
            ex.dumbells[wIndex] = parseInt(weight);
            if (isNaN(ex.dumbells[wIndex])) {
              throw new Error(place + " non-numeric weight");
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
          dumbells: this.dumbells,
          ref: this
        };
      };

      return BaseClient;

    })();
    return BaseClient;
  });

}).call(this);
