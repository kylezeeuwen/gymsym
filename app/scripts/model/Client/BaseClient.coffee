angular.module('gymsym').factory 'BaseClient', () ->

  class BaseClient

    @create: (id,name,program) ->
      throw new Error "override in child class"
      
    constructor: (@uniqId, @name, workoutPlan) ->
      @workoutPlan = @validateWorkoutPlan workoutPlan
      @xlastStatus = 'idle'
      @status = 'idle'
      @currentExercise = null
      @dumbells = []
      #get time from service dont pass it around
      @time = 0
    
    advanceTime: (time) ->
      @time = time
      @xlastStatus = @status
      switch @status
        when "idle" then @transitionsFromIdle()
        when "exercising" then @transitionsFromExercising()
        else throw new Error "Invalid client state #{clientStatus} for client #{client.name} at time #{@time}"

      @status

    transitionsFromIdle: () ->
      nextExercise = @getNextExercise()
      if nextExercise
        requiredWeights = nextExercise.dumbells
        #TODO extend for multiple dumbells
        if @rack.hasWeights requiredWeights
          dumbells = @rack.takeDumbells requiredWeights
          @startExercise nextExercise, dumbells
          @status = 'exercising'

      else
        @status = 'finished'

    transitionsFromExercising: (client) ->
      if @currentExercise.startTime + @currentExercise.duration < @time
        @finishExercise()
        @status = 'idle'

    getNextExercise: () ->
      _.findWhere @workoutPlan, status: 'pending'

    startWorkout: (rack) ->
      #TODO is there shorthand for this assignment stuff
      @rack = rack

    startExercise: (exercise, dumbells) ->
      @currentExercise = @workoutPlan[exercise.id]
      @currentExercise.status = 'active'
      @currentExercise.startTime = @time
      @dumbells = @dumbells.concat dumbells

    finishExercise: () ->
      @currentExercise.status = 'complete'
      @currentExercise.endTime = @time

      @returnDumbells()

    returnDumbell: (slot, dumbell) ->
      @rack.putDumbell slot, dumbell

    returnDumbells: () ->
      throw new Error "Override returndumbells() in child class"

    validateWorkoutPlan: (workoutPlan) ->
      throw new Error 'workoutPlan must be array' unless workoutPlan instanceof Array

      for ex, index in workoutPlan
        place = "workoutPlan[#{index}]"
        throw new Error "#{place} missing name" unless 'name' of ex

        throw new Error "#{place} missing duration" unless 'duration' of ex
        ex.duration = parseInt ex.duration
        throw new Error "#{place} non-numeric duration" if isNaN ex.duration

        throw new Error "#{place} missing dumbells" unless 'dumbells' of ex
        throw new Error "#{place} dumbells must be array" unless ex.dumbells instanceof Array
        for weight, wIndex in ex.dumbells
          place = "workoutPlan[#{index}].dumbells[#{wIndex}]"
          ex.dumbells[wIndex] = parseInt weight
          throw new Error "#{place} non-numeric weight" if isNaN ex.dumbells[wIndex]
        
        #pending, active, complete
        ex.status = 'pending'
        ex.id = index

      workoutPlan

    id: () ->
      @uniqId

    type: () ->
      unless @clientType
        throw new Error "must set type in child class"
      @clientType

    dump: () ->
      return {
        id: @id()
        type: @type()
        name: @name
        status: @status
        dumbells: @dumbells
      }

  BaseClient