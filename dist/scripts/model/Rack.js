(function() {
  var slice = [].slice;

  angular.module('gymsym').factory('Rack', function(Dumbell) {
    var Rack;
    Rack = (function() {
      Rack.curMaxId = 0;

      Rack.getNewId = function() {
        this.curMaxId++;
        return this.curMaxId;
      };

      Rack.create = function() {
        var labels;
        labels = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return new Rack(labels);
      };

      function Rack(labels) {
        var label;
        this.numSlots = labels.length;
        this.spaces = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = labels.length; i < len; i++) {
            label = labels[i];
            results.push(this.makeSpace(label));
          }
          return results;
        }).call(this);
        this.uniqId = Rack.getNewId();
      }

      Rack.prototype.advanceTime = function(time) {
        return this.spaces.forEach(function(space) {
          return space.fresh = false;
        });
      };

      Rack.prototype.makeSpace = function(labelText) {
        var label;
        label = parseInt(labelText);
        if (isNaN(labelText)) {
          throw new Error("invalid label '" + labelText + "'");
        }
        return {
          label: label,
          dumbell: null,
          fresh: false
        };
      };

      Rack.prototype.id = function() {
        return this.uniqId;
      };

      Rack.prototype.numSlots = function() {
        return this.numSlots;
      };

      Rack.prototype.validateSlotIndex = function(slotIndex) {
        if (!(typeof slotIndex === 'number')) {
          throw new Error("invalid slotIndex '" + slotIndex + "'");
        }
        if (isNaN(slotIndex)) {
          throw new Error("invalid slotIndex '" + slotIndex + "'");
        }
        if (slotIndex < 0 || slotIndex >= this.numSlots) {
          throw new Error("slotIndex '" + slotIndex + "' out of range");
        }
      };

      Rack.prototype.putDumbell = function(slotIndexArg, dumbell) {
        var slotIndex;
        if (!(dumbell instanceof Dumbell)) {
          throw new Error('invalid dumbell call putDumbell(index,dumbell)');
        }
        slotIndex = parseInt(slotIndexArg);
        this.validateSlotIndex(slotIndex);
        if (this.spaces[slotIndex]['dumbell']) {
          throw new Error('space full');
        }
        this.spaces[slotIndex]['dumbell'] = dumbell;
        return this.spaces[slotIndex]['fresh'] = true;
      };

      Rack.prototype.takeFromSlot = function(slotIndexArg) {
        var dumbell, slotIndex;
        slotIndex = parseInt(slotIndexArg);
        this.validateSlotIndex(slotIndex);
        if (!this.spaces[slotIndex]['dumbell']) {
          throw new Error('space empty');
        }
        dumbell = this.spaces[slotIndex]['dumbell'];
        this.spaces[slotIndex]['dumbell'] = null;
        return dumbell;
      };

      Rack.prototype.hasWeights = function(requiredWeights) {
        var availableWeights, hasAll, i, index, len, weight;
        availableWeights = [];
        _.map(this.spaces, function(space) {
          if (space.dumbell && !space.fresh) {
            return availableWeights.push(space.dumbell.weight());
          }
        });
        hasAll = true;
        for (i = 0, len = requiredWeights.length; i < len; i++) {
          weight = requiredWeights[i];
          index = _.indexOf(availableWeights, weight);
          if (index === -1) {
            hasAll = false;
            break;
          } else {
            availableWeights.splice(index, 1);
          }
        }
        return hasAll;
      };

      Rack.prototype.takeDumbells = function(requiredWeights) {
        var dumbells, i, len, weight;
        dumbells = [];
        for (i = 0, len = requiredWeights.length; i < len; i++) {
          weight = requiredWeights[i];
          dumbells.push(this.takeFirstDumbellWithWeight(weight));
        }
        return dumbells;
      };

      Rack.prototype.takeFirstDumbellWithWeight = function(weight) {
        var indexes;
        indexes = this.getSlotIndexesForWeight(weight);
        if (!(indexes.length > 0)) {
          throw new Error("cannot takeFirstDumbellWithWeight(" + weight + "): no dumbell available");
        }
        return this.takeFromSlot(indexes[0]);
      };

      Rack.prototype.getSlotIndexesForWeight = function(weight) {
        var index, indexes, ref, ref1, space;
        indexes = [];
        ref = this.spaces;
        for (index in ref) {
          space = ref[index];
          if (((ref1 = space.dumbell) != null ? ref1.weight() : void 0) === weight && !space.fresh) {
            indexes.push(parseInt(index));
          }
        }
        return indexes;
      };

      Rack.prototype.getEmptySlotsForDumbell = function(dumbell) {
        var i, index, len, ref, slots, space;
        if (dumbell && !(dumbell instanceof Dumbell)) {
          throw new 'invalid dumbell: not a Dumbell';
        }
        slots = [];
        ref = this.spaces;
        for (index = i = 0, len = ref.length; i < len; index = ++i) {
          space = ref[index];
          if (!space['dumbell']) {
            if ((!dumbell) || dumbell.weight() === space.label) {
              slots.push(index);
            }
          }
        }
        return slots;
      };

      Rack.prototype.getEmptySlots = function() {
        return this.getEmptySlotsForDumbell(null);
      };

      Rack.prototype.dump = function() {
        var data, id, index, printSpace;
        id = this.id();
        printSpace = function(space, index) {
          var spaceData;
          spaceData = {
            label: space.label,
            weight: null,
            index: parseInt(index),
            id: id + "-" + index
          };
          if (space.dumbell instanceof Dumbell) {
            spaceData.weight = space.dumbell.weight();
            spaceData.dumbell = space.dumbell;
          }
          return spaceData;
        };
        data = (function() {
          var i, ref, results;
          results = [];
          for (index = i = 0, ref = this.numSlots - 1; 0 <= ref ? i <= ref : i >= ref; index = 0 <= ref ? ++i : --i) {
            results.push(printSpace(this.spaces[index], index));
          }
          return results;
        }).call(this);
        return data;
      };

      return Rack;

    })();
    return Rack;
  });

}).call(this);
