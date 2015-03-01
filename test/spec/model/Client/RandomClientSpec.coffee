describe 'RandomClient:', ->

  beforeEach ->
    window.angular.mock.module 'gymsym'

  beforeEach inject (_Client_, _Rack_, _Dumbell_) ->
    @Client = _Client_
    @Rack = _Rack_
    @Dumbell = _Dumbell_

  describe 'returnDumbells:', ->

    beforeEach ->
      @rack = @Rack.create 2, 1
      @client = @Client.create  'c1', 'Random', []
      @client.startWorkout @rack

      @d2 = @Dumbell.create 2

      spyOn(Math, "random").and.returnValue 0.9999

    it 'client will put the dumbells in the random spot every time (because they are an asshole)', ->
      @client.dumbells.push @d2
      @client.returnDumbells()

      expect(@rack.spaces).toEqual [
        { label: 2, dumbell: null, fresh: false }
        { label: 1, dumbell: @d2, fresh: true }
      ]

      expect(Math.random).toHaveBeenCalled
