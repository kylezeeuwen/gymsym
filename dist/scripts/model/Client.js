(function() {
  angular.module('gymsym').factory('Client', function() {
    var Client;
    Client = (function() {
      Client.curMaxId = -1;

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
        this.time = 0;
      }

      Client.prototype.advanceTime = function(time) {
        this.time = time;
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

      Client.prototype.transitionsFromIdle = function() {
        var dumbells, nextExercise, requiredWeights;
        nextExercise = this.getNextExercise();
        if (nextExercise) {
          requiredWeights = nextExercise.dumbells;
          if (this.rack.hasWeights(requiredWeights)) {
            dumbells = this.rack.takeDumbells(requiredWeights);
            return this.startExercise(nextExercise, dumbells);
          }
        } else {
          return this.finishWorkout();
        }
      };

      Client.prototype.transitionsFromExercising = function(client) {
        if (this.currentExercise.startTime + this.currentExercise.duration < this.time) {
          return this.finishExercise();
        }
      };

      Client.prototype.getNextExercise = function() {
        return _.findWhere(this.workoutPlan, {
          status: 'pending'
        });
      };

      Client.prototype.startWorkout = function(rack) {
        return this.rack = rack;
      };

      Client.prototype.finishWorkout = function() {
        return this.status = 'finished';
      };

      Client.prototype.startExercise = function(exercise, dumbells) {
        this.currentExercise = this.workoutPlan[exercise.id];
        this.currentExercise.status = 'active';
        this.currentExercise.startTime = this.time;
        this.status = 'exercising';
        return this.dumbells = this.dumbells.concat(dumbells);
      };

      Client.prototype.finishExercise = function() {
        this.currentExercise.status = 'complete';
        this.currentExercise.endTime = this.time;
        this.returnDumbells();
        return this.status = 'idle';
      };

      Client.prototype.returnDumbells = function() {
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
            throw new Error("Cannot return dumbell " + dumbell + ": rack is full");
          }
        }
        return _results;
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
          id: this.id(),
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
