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

  describe 'takeDumbell:', ->

    beforeEach ->
      @rack = @Rack.create 1, 2
      @dumbell = @Dumbell.create 1
      @makeCallTakeDumbellFunction = (index) ->
        theRack = @Rack.create 1, 2
        return ->
          theRack.takeDumbell index

    it 'it gets the dumbell', ->
      @rack.putDumbell 0, @dumbell
      dumbell = @rack.takeDumbell 0
      expect(dumbell).toBe @dumbell

    it 'removes the dumbell from the rack', ->
      @rack.putDumbell 0, @dumbell
      dumbell = @rack.takeDumbell 0
      expect(@rack.spaces[0]).toEqual { label: 1, dumbell: null }

    it 'leaves the spaces array the same length', ->
      @rack.putDumbell 0, @dumbell
      dumbell = @rack.takeDumbell 0
      expect(@rack.spaces.length).toBe 2

    it 'throws error if slot is empty', ->
      expect(@makeCallTakeDumbellFunction 0).toThrow new Error 'space empty'
      
    it 'throws error if slot is non numeric', ->
      expect(@makeCallTakeDumbellFunction 'dogs').toThrow new Error "invalid slotIndex 'NaN'"

    it 'throws error if slot is negative', ->
      expect(@makeCallTakeDumbellFunction -1).toThrow new Error "slotIndex '-1' out of range"

    it 'throws error if slot is greater than numSlots', ->    
      expect(@makeCallTakeDumbellFunction 2).toThrow new Error "slotIndex '2' out of range"
 
  describe 'hasWeight:', ->
 
     beforeEach ->
       @rack = @Rack.create 1, 2, 3, 4
       @rack.putDumbell 0, @Dumbell.create 10
       @rack.putDumbell 1, @Dumbell.create 10
       @rack.putDumbell 2, @Dumbell.create 5

     it 'returns true if the weight is present', ->  
       expect(@rack.hasWeight 10).toBe true
       
     it 'returns false if the weight is present', ->
       expect(@rack.hasWeight 1).toBe false
 
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
