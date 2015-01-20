describe 'ClientSpec:', ->

  beforeEach -> 
    window.angular.mock.module 'gymsym'
  
  beforeEach inject (_Client_) ->
    @Client = _Client_

  describe 'constructor:', ->
    beforeEach ->
      exercise1 =
        name: 'exercise1'
        duration: 5
        weights: [10, 10]

      exercise2 =
        name: 'exercise2'
        duration: 5
        weights: [5]

      @client = @Client.create 'client1', [ exercise1, exercise2 ]

    it 'name is saved', ->
      expect(@client.name).toBe 'client1'

    it 'workout plan is saved', ->
      expect(@client.workoutPlan[0].name).toBe 'exercise1'
      expect(@client.workoutPlan[1].name).toBe 'exercise2'

    it 'increments the id', ->
      @client2 = @Client.create 'name', []

      expect(@client.id()).toBe 1
      expect(@client2.id()).toBe 2

    describe 'validateWorkoutPlan: ', ->
      #XXX: TODO test validation

    
