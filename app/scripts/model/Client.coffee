angular.module('gymsym').factory 'Client', () ->

  class Client
    @curMaxId: -1

    @getNewId: () ->
      @curMaxId++
      @curMaxId

    @create: (name, program) ->
      new Client(name, program)

    constructor: (name, workoutPlan) ->
      @name = name
      @workoutPlan = @validateWorkoutPlan workoutPlan
      @uniqId = Client.getNewId()
      @status = 'idle'
      @currentExercise = null
      @dumbells = []
      #get time from service dont pass it around
      @time = 0
    
    advanceTime: (time) ->
      @time = time
      switch @status
        when "idle" then @transitionsFromIdle()
        when "exercising" then @transitionsFromExercising()
        else throw new Error "Invalid client state #{clientStatus} for client #{client.name} at time #{@time}"

      @status

    #TODO nest this via transitionsFromIdle ?
    transitionsFromIdle: () ->
      nextExercise = @getNextExercise()
      if nextExercise
        requiredWeights = nextExercise.dumbells
        #TODO extend for multiple dumbells
        if @rack.hasWeights requiredWeights
          dumbells = @rack.takeDumbellsWithWeights requiredWeights
          @startExercise nextExercise, dumbells

      else
        @finishWorkout()

    transitionsFromExercising: (client) ->
      if @currentExercise.startTime + @currentExercise.duration < @time
        #TODO This is where client needs access to rack via gym
        @finishExercise()

    getNextExercise: () ->
      _.findWhere @workoutPlan, status: 'pending'

    startWorkout: (rack) ->
      #TODO is there shorthand for this assignment stuff
      @rack = rack

    finishWorkout: () ->
      @status = 'finished'

    startExercise: (exercise, dumbells) ->
      @currentExercise = @workoutPlan[exercise.id]
      @currentExercise.status = 'active'
      @currentExercise.startTime = @time

      @status = 'exercising'

      @dumbells = @dumbells.concat dumbells

    finishExercise: () ->
      @currentExercise.status = 'complete'
      @currentExercise.endTime = @time

      @returnDumbells()

      @status = 'idle'

    returnDumbells: () ->
      while dumbell = @dumbells.shift()
        availableCorrectSlots = @rack.getEmptySlotsForDumbell dumbell
        availableSlots = @rack.getEmptySlots()
        if availableCorrectSlots.length > 0
          @rack.putDumbell availableCorrectSlots[0], dumbell
        else if availableSlots.length > 0
          @rack.putDumbell availableSlots[0], dumbell
        else
          throw new Error "Cannot return dumbell #{dumbell}: rack is full"

    validateWorkoutPlan: (workoutPlan) ->
      throw new Error 'workoutPlan must be array' unless workoutPlan instanceof Array

      for ex, index in workoutPlan
        place = "workoutPlan[#{index}]"
        throw new Error "#{place} missing name" unless 'name' of ex

        throw new Error "#{place} missing duration" unless 'duration' of ex
        ex.duration = parseInt ex.duration
        throw new Error "#{place} invalid duraiton '#{ex.duration}'" unless _.isNumber ex.duration

        throw new Error "#{place} missing dumbells" unless 'dumbells' of ex
        throw new Error "#{place} dumbells must be array" unless ex.dumbells instanceof Array
        for weight, wIndex in ex.dumbells
          place = "workoutPlan[#{index}].dumbells[#{wIndex}]"
          ex.dumbells[wIndex] = parseInt weight
          throw new Error "#{place} invalid weight '#{ex.dumbells[wIndex]}'" unless _.isNumber ex.dumbells[wIndex]
        
        #pending, active, complete
        ex.status = 'pending'
        ex.id = index

      workoutPlan

    id: () ->
      @uniqId

    dump: () ->
      return {
        id: @id()
        name: @name
        status: @status
        dumbells: @dumbells
      }

  Client