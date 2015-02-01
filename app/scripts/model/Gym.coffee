angular.module('gymsym').factory 'Gym', () ->

  class Gym
    @curMaxId: 0

    @getNewId: () ->
      @curMaxId++
      @curMaxId

    @create: () ->
      new Gym()

    constructor: () ->
      @racks = []
      @clients = []
      @time = 0
      @uniqId = Gym.getNewId()

    id: () ->
      @uniqId

    addRack: (rack) ->
      @racks.push rack

    addClient: (client) ->
      @clients.push client
      client.startWorkout @time

    removeClient: (exitingClient) ->
      exitingClient.finishWorkout @time
      #TODO clients should be dictionary by ID ?
      @clients = _.filter @clients, (client) -> 
        client.id() != exitingClient.id()

    advanceTime: () ->
      @time += 1

      for client in @clients
        @updateClient(client)

      console.log "Time #{@time}"
      console.log @dump()
      console.log JSON.stringify @dump().clients

    updateClient: (client) ->
      clientStatus = client.status

      switch clientStatus
        when "idle" then @idleCode client
        when "exercising" then @exercisingCode client
        else throw new Error "Invalid client state #{clientStatus} for client #{client.name} at time #{@time}"

    idleCode: (client) ->
      nextExercise = client.getNextExercise()
      if nextExercise
        requiredDumbells = nextExercise.dumbells
        #TODO Simplify gym down to one rack for now
        for rack in @racks
          #TODO extend for multiple dumbells
          if rack.hasWeight requiredDumbells[0]
            dumbell = rack.takeFirstDumbellWithWeight requiredDumbells[0]
            client.startExercise nextExercise, dumbell, @time

      else
        @removeClient(client)

    exercisingCode: (client) ->
      currentExercise = client.getCurrentExercise()
      if currentExercise.startTime + currentExercise.duration < @time
        #TODO This is where client needs access to rack via gym
        client.finishExercise @time

    dump: () ->
      data =
        racks: []
        clients: []

      #XXX Add clients to dump

      for rack in @racks
        data.racks.push rack.dump()
      for client in @clients
        data.clients.push client.dump()


      data

  Gym
