describe 'BaseClientSpec (via AverageJoe child class):', ->

  beforeEach ->
    window.angular.mock.module 'gymsym'

  beforeEach inject (_Client_, _Rack_, _Dumbell_) ->
    @Client = _Client_
    @Rack = _Rack_
    @Dumbell = _Dumbell_

  describe 'constructor:', ->
    beforeEach ->
      exercise1 =
        name: 'exercise1'
        duration: 5
        dumbells: [10, 10]

      exercise2 =
        name: 'exercise2'
        duration: 5
        dumbells: [5]

      @client = @Client.create 'client1', 'AverageJoe', [ exercise1, exercise2 ]

    it 'name is saved', ->
      expect(@client.name).toBe 'client1'

    it 'initial status is set to idle', ->
      expect(@client.status).toBe 'idle'

    it 'initial exercise and dumbells are empty', ->
      expect(@client.dumbells).toEqual []
      expect(@client.currentExercise).toBe null

    it 'workout plan is saved', ->
      expect(@client.workoutPlan[0].name).toBe 'exercise1'
      expect(@client.workoutPlan[1].name).toBe 'exercise2'

    it 'increments the id', ->
      @client2 = @Client.create 'name', 'AverageJoe', []

      expect(@client.id()).toBe 0
      expect(@client2.id()).toBe 1

  describe 'validateWorkoutPlan: ', ->

    beforeEach ->
      @makeThrowsFn = (plan) ->
        return =>
          @Client.create 'c1', 'AverageJoe', plan

    it 'accepts a valid plan', ->
      plan = [{ name: 'ex1', duration: 4, dumbells: [1] }]
      expect(@makeThrowsFn plan).not.toThrow()

    it 'must be array', ->
      plan = 'dogs'
      expect(@makeThrowsFn plan).toThrow new Error 'workoutPlan must be array'

    it 'entries must have name', ->
      plan = [{ duration: 4, dumbells: [1] }]
      expect(@makeThrowsFn plan).toThrow new Error "workoutPlan[0] missing name"

    it 'entries must have numeric duration', ->
      plan = [{ name: 'ex1', duration: 'dogs', dumbells: [1] }]
      expect(@makeThrowsFn plan).toThrow new Error "workoutPlan[0] non-numeric duration"

    it 'entries must have dumbells array', ->
      plan = [{ name: 'ex1', duration: 4, dumbells: 'dogs' }]
      expect(@makeThrowsFn plan).toThrow new Error "workoutPlan[0] dumbells must be array"

    it 'entries must have numeric dumbells', ->
      plan = [{ name: 'ex1', duration: 4, dumbells: ['dogs'] }]
      expect(@makeThrowsFn plan).toThrow new Error "workoutPlan[0].dumbells[0] non-numeric weight"

  describe 'transition (via advanceTime):', ->

    describe 'from idle state:', ->

      beforeEach ->
        @rack = @Rack.create 1
        @rack.putDumbell 0, @Dumbell.create 1
        @rack.advanceTime 1
        @workoutPlan = [{ name: 'c1-ex1', duration: 1, dumbells: [1] }]
        @client = @Client.create 'c1', 'AverageJoe', @workoutPlan
        @client.startWorkout @rack

      it 'finishes workout it there are no more exercises', ->
        @client.workoutPlan[0].status = 'complete'
        expect(@client.status).toBe 'idle'
        @client.advanceTime 1
        expect(@client.status).toBe 'finished'

      it 'starts exercising if weights are available', ->
        expect(@client.status).toBe 'idle'
        @client.advanceTime 1
        expect(@client.status).toBe 'exercising'

      it 'does not start exercising if there are not weights available', ->
        @rack.takeFromSlot 0
        expect(@client.status).toBe 'idle'
        @client.advanceTime 1
        expect(@client.status).toBe 'waiting'

    describe 'from exercising state:', ->

      beforeEach ->
        @rack = @Rack.create 1
        @rack.putDumbell 0, @Dumbell.create 1
        @rack.advanceTime 1
        @workoutPlan = [{ name: 'c1-ex1', duration: 2, dumbells: [1] }]
        @client = @Client.create 'c1', 'AverageJoe', @workoutPlan
        @client.startWorkout @rack
        @client.advanceTime 1

      it 'the user continues exercising until the duration is complete', ->
        @client.advanceTime 2
        expect(@client.status).toBe 'exercising'

      it 'the user finishes exercise when duration is over', ->
        @client.advanceTime 4
        expect(@client.status).toBe 'idle'
