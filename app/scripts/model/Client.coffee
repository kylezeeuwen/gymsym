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

    getNextExercise: () ->

    workoutComplete: () ->

    advanceTime: () ->

    validateWorkoutPlan: (workoutPlan) ->
      throw new Error 'workoutPlan must be array' unless workoutPlan instanceof Array

      for ex, index in workoutPlan
        place = "workoutPlan[#{index}]"
        throw new Error "#{place} missing name" unless 'name' of ex

        throw new Error "#{place} missing duration" unless 'duration' of ex
        ex.duration = parseInt ex.duration
        throw new Error "#{place} invalid duraiton '#{ex.duration}'" unless _.isNumber ex.duration

        throw new Error "#{place} missing weights" unless 'weights' of ex
        throw new Error "#{place} weights must be array" unless ex.weights instanceof Array
        for weight, wIndex in ex.weights
          place = "workoutPlan[#{index}].weights[#{wIndex}]"
          ex.weights[wIndex] = parseInt weight
          throw new Error "#{place} invalid weight '#{ex.weights[wIndex]}'" unless _.isNumber ex.weights[wIndex]
        
        ex.status = 'pending'

      workoutPlan

    id: () ->
      @uniqId

  Client