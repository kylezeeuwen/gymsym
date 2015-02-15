describe 'RackSpec:', ->

  beforeEach -> 
    window.angular.mock.module 'gymsym'
  
  beforeEach inject (_Dumbell_, _Rack_) ->
    @Rack = _Rack_
    @Dumbell = _Dumbell_

  describe 'constructor:', ->
    beforeEach ->
      @rack = @Rack.create 1, 2

      @makeCallConstructorFunction = (labels...) ->
        rackClass = @Rack
        return ->
          rackClass.create labels

    it 'initializes an array of spaces with specified labels', ->
      expect(@rack.spaces.length).toBe 2

    it 'sets the labels correctly', ->
      expect(@rack.spaces[0].label).toBe 1
      expect(@rack.spaces[1].label).toBe 2

    it 'sets numSlots to specified size', ->
      expect(@rack.numSlots).toBe 2

    it 'increments the id', ->
      @rack2 = @Rack.create 1

      expect(@rack.id()).toBe 1
      expect(@rack2.id()).toBe 2

    it 'throws error on non numeric label', ->
      expect(@makeCallConstructorFunction('six')).toThrow new Error "invalid label 'six'"
    
  #XXX: Todo add code to prevent dumbell instance from being added twice
  #or being in same rack at once

  describe 'putDumbell:', ->

    beforeEach ->
      @rack = @Rack.create 1, 2
      @dumbell = @Dumbell.create 1
      @makeCallPutDumbellFunction = (index,dumbell,numSpaces=2) ->
        theRack = @Rack.create numSpaces
        theRack.putDumbell 0, @Dumbell.create 1000
        return ->
          theRack.putDumbell index, dumbell

    it 'puts dumbell in specified slot', ->
      @rack.putDumbell(1, @dumbell)
      expect(@rack.spaces[1]).toEqual { label: 2, dumbell: @dumbell }
      expect(@rack.spaces[0]).toEqual { label: 1, dumbell: null }

    it 'throws error if slot is taken', ->
      expect(@makeCallPutDumbellFunction 0, @dumbell).toThrow new Error 'space full'
      
    it 'throws error if non-dumbell is provided', ->
      expect(@makeCallPutDumbellFunction 1, 'poop').toThrow new Error 'invalid dumbell call putDumbell(index,dumbell)'

    it 'throws error if slot is non numeric', ->
      expect(@makeCallPutDumbellFunction 'dogs', @dumbell).toThrow new Error "invalid slotIndex 'NaN'"

    it 'throws error if slot is negative', ->
      expect(@makeCallPutDumbellFunction -1, @dumbell).toThrow new Error "slotIndex '-1' out of range"

    it 'throws error if slot is greater than numSlots', ->    
      expect(@makeCallPutDumbellFunction 2, @dumbell).toThrow new Error "slotIndex '2' out of range"

  #XXX TODO test getEmptySlotsForDumbell
  #XXX TODO test getEmptySlots
  describe 'getEmptySlots*:', ->

    beforeEach ->
      @rack = @Rack.create 3, 6
      @rack.putDumbell 0, @Dumbell.create 10

    it 'getEmptySlots reports the empty slots', ->
      expect(@rack.getEmptySlots()).toEqual [1]

    it 'getEmptySlotsForDumbell reports no empty slots if slot taken', ->
      expect(@rack.getEmptySlotsForDumbell(@Dumbell.create 3)).toEqual []

    it 'getEmptySlotsForDumbell reports 1 empty slot for matching weight', ->
      console.log 'stuff'
      expect(@rack.getEmptySlotsForDumbell(@Dumbell.create 6)).toEqual [1]

    it 'getEmptySlotsForDumbell reports no empty slots for weight != label', ->
      expect(@rack.getEmptySlotsForDumbell(@Dumbell.create 10)).toEqual []

    it 'throws error unless a Dumbell is passed in', ->
      @makeExceptionFunction = (input) ->
        theRack = @rack
        return ->
          theRack.getEmptySlotsForDumbell input
        expect(@makeExceptionFunction 3).toThrow new Err 'invalid dumbell: not a Dumbell'

  describe 'takeFromSlot:', ->

    beforeEach ->
      @rack = @Rack.create 1, 2
      @dumbell = @Dumbell.create 1
      @makeCallTakeFromSlotFunction = (index) ->
        theRack = @Rack.create 1, 2
        return ->
          theRack.takeFromSlot index

    it 'it gets the dumbell', ->
      @rack.putDumbell 0, @dumbell
      dumbell = @rack.takeFromSlot 0
      expect(dumbell).toBe @dumbell

    it 'removes the dumbell from the rack', ->
      @rack.putDumbell 0, @dumbell
      dumbell = @rack.takeFromSlot 0
      expect(@rack.spaces[0]).toEqual { label: 1, dumbell: null }

    it 'leaves the spaces array the same length', ->
      @rack.putDumbell 0, @dumbell
      dumbell = @rack.takeFromSlot 0
      expect(@rack.spaces.length).toBe 2

    it 'throws error if slot is empty', ->
      expect(@makeCallTakeFromSlotFunction 0).toThrow new Error 'space empty'
      
    it 'throws error if slot is non numeric', ->
      expect(@makeCallTakeFromSlotFunction 'dogs').toThrow new Error "invalid slotIndex 'NaN'"

    it 'throws error if slot is negative', ->
      expect(@makeCallTakeFromSlotFunction -1).toThrow new Error "slotIndex '-1' out of range"

    it 'throws error if slot is greater than numSlots', ->    
      expect(@makeCallTakeFromSlotFunction 2).toThrow new Error "slotIndex '2' out of range"
 
  describe 'takeDumbells:', ->

    beforeEach ->
      @rack = @Rack.create 0, 1, 2

    it 'gets multiple dumbells if they are present', ->
      dumbell0 =  @Dumbell.create 10    
      dumbell1 =  @Dumbell.create 10    
      @rack.putDumbell 0, dumbell0
      @rack.putDumbell 1, dumbell1
      dumbells = @rack.takeDumbells [10,10]
      expect(dumbells).toEqual [dumbell0,dumbell1]
      expect(@rack.getEmptySlotsForDumbell()).toEqual [0,1,2]

    it 'throws error if dumbells are not present', ->
      @throwsFunction = (index) ->
        theRack = @rack
        return ->
          theRack.takeDumbells [10,10]
      
      expect(@throwsFunction()).toThrow new Error "cannot takeFirstDumbellWithWeight(10): no dumbell available"

  describe 'hasWeights:', ->
    beforeEach ->
      @rack = @Rack.create 1, 2, 3, 4
      @rack.putDumbell 0, @Dumbell.create 10
      @rack.putDumbell 1, @Dumbell.create 10
      @rack.putDumbell 2, @Dumbell.create 5

    it 'returns true if empty array passed', ->  
      expect(@rack.hasWeights []).toBe true

    it 'returns true if single weight is present', ->  
      expect(@rack.hasWeights [10]).toBe true
      
    it 'returns false if the weight is not present', ->
      expect(@rack.hasWeights [1]).toBe false

    it 'returns true if multiple weights are present', ->  
      expect(@rack.hasWeights [10, 10]).toBe true
      
    it 'returns false if the some are present and some are not', ->
      expect(@rack.hasWeights [10, 4]).toBe false


  describe 'getSlotIndexesForWeight:', ->
    
    beforeEach ->
      @rack = @Rack.create 1, 2, 3, 4
      @rack.putDumbell 0, @Dumbell.create 10
      @rack.putDumbell 1, @Dumbell.create 10
      @rack.putDumbell 2, @Dumbell.create 5

    it 'returns array of indexes for weights that are present', ->
      expect(@rack.getSlotIndexesForWeight 10).toEqual [0,1]
    it 'returns empty array for weights that are not present', ->
      expect(@rack.getSlotIndexesForWeight 1).toEqual []

  describe 'dump:', ->
    it 'dumps empty and full spaces', ->
      rack = @Rack.create 1, 2
      rack.putDumbell 1, @Dumbell.create 10

      expect(rack.dump()).toEqual [
        { label: 1, weight: null, index: 0, id: '1-0' }
        { label: 2, weight: 10, index: 1, id: '1-1' }
      ]
