angular.module('gymsym').factory 'Client', () ->

  class Client
    @curMaxId: 0

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
    
    getNextExercise: () ->
      _.findWhere @workoutPlan, status: 'pending'

    getCurrentExercise: () ->
      @currentExercise
      
    startWorkout: (startTime) ->
      @startTime = startTime

    finishWorkout: (endTime) ->
      @endTime = endTime
      @status = 'finished'

    startExercise: (exercise, dumbell, startTime) ->
      @currentExercise = @workoutPlan[exercise.id]
      @currentExercise.status = 'active'
      @currentExercise.startTime = startTime

      @status = 'exercising'

      @dumbells.push dumbell

    finishExercise: (endTime) ->
      @currentExercise.status = 'complete'
      @currentExercise.endTime = endTime

      @status = 'idle'

      @dumbells = []

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
        name: @name
        status: @status
        dumbells: @dumbells
      }

  Client