describe 'AverageJoeClient:', ->

  beforeEach -> 
    window.angular.mock.module 'gymsym'
  
  beforeEach inject (_Client_, _Rack_, _Dumbell_) ->
    @Client = _Client_
    @Rack = _Rack_
    @Dumbell = _Dumbell_

  describe 'returnDumbells:', ->

    beforeEach ->
      @rack = @Rack.create 2, 2, 1
      @client = @Client.create  'c1', 'AverageJoe', []
      @client.startWorkout @rack

      @d1 = @Dumbell.create 1
      @d2 = @Dumbell.create 2

    it 'client will put the dumbells in the right spot if possible', ->
      @client.dumbells.push @d1
      @client.returnDumbells()

      expect(@rack.spaces).toEqual [
        { label: 2, dumbell: null }
        { label: 2, dumbell: null }
        { label: 1, dumbell: @d1 }
      ]

    it 'client will put the dumbells in first available spot if the right spot is not available', ->
      @client.dumbells.push @d1
      @rack.spaces[2].dumbell = @d2
      @client.returnDumbells()

      expect(@rack.spaces).toEqual [
        { label: 2, dumbell: @d1 }
        { label: 2, dumbell: null }
        { label: 1, dumbell: @d2 }
      ]

    it 'client will throw error if there is no space for weight', ->
      @client.dumbells.push @d1
      @rack.spaces[0].dumbell = @d2
      @rack.spaces[1].dumbell = @Dumbell.create 1
      @rack.spaces[2].dumbell = @Dumbell.create 1

      throwsFn = () =>
        @client.returnDumbells()

      expect(throwsFn).toThrow new Error 'Cannot return dumbell 1: rack is full'
