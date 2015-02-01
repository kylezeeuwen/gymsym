(function() {
  var __slice = [].slice;

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
        labels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return new Rack(labels);
      };

      function Rack(labels) {
        var label;
        this.numSlots = labels.length;
        this.spaces = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = labels.length; _i < _len; _i++) {
            label = labels[_i];
            _results.push(this.makeSpace(label));
          }
          return _results;
        }).call(this);
        this.uniqId = Rack.getNewId();
      }

      Rack.prototype.makeSpace = function(labelText) {
        var label;
        label = parseInt(labelText);
        if (isNaN(labelText)) {
          throw new Error("invalid label '" + labelText + "'");
        }
        return {
          label: label,
          dumbell: null
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
        return this.spaces[slotIndex]['dumbell'] = dumbell;
      };

      Rack.prototype.takeDumbell = function(slotIndexArg) {
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

      Rack.prototype.hasWeight = function(weight) {
        if (this.getSlotIndexesForWeight(weight).length > 0) {
          return true;
        } else {
          return false;
        }
      };

      Rack.prototype.takeFirstDumbellWithWeight = function(weight) {
        var indexes;
        indexes = this.getSlotIndexesForWeight(weight);
        if (!(indexes.length > 0)) {
          throw new error("cannot takeFirstDumbellWithWeight(" + weight + "): no dumbell available");
        }
        return this.takeDumbell(indexes[0]);
      };

      Rack.prototype.getSlotIndexesForWeight = function(weight) {
        var index, indexes, space, _ref, _ref1;
        indexes = [];
        _ref = this.spaces;
        for (index in _ref) {
          space = _ref[index];
          if (((_ref1 = space.dumbell) != null ? _ref1.weight() : void 0) === weight) {
            indexes.push(parseInt(index));
          }
        }
        return indexes;
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
            id: "" + id + "-" + index
          };
          if (space.dumbell instanceof Dumbell) {
            spaceData.weight = space.dumbell.weight();
          }
          return spaceData;
        };
        data = (function() {
          var _i, _ref, _results;
          _results = [];
          for (index = _i = 0, _ref = this.numSlots - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; index = 0 <= _ref ? ++_i : --_i) {
            _results.push(printSpace(this.spaces[index], index));
          }
          return _results;
        }).call(this);
        return data;
      };

      return Rack;

    })();
    return Rack;
  });

}).call(this);
