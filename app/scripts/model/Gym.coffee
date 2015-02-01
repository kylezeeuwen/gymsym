angular.module('gymsym').factory 'Gym', () ->

  class Gym
    @curMaxId: 0

    @getNewId: () ->
      @curMaxId++
      @curMaxId

    @create: () ->
      new Gym()

    constructor: () ->
      @rack = null
      @clients = []
      @time = 0
      @uniqId = Gym.getNewId()

    id: () ->
      @uniqId

    setRack: (rack) ->
      @rack = rack

    addClient: (client) ->
      @clients.push client
      client.startWorkout @rack

    removeClient: (exitingClient) ->
      #TODO clients should be dictionary by ID ?
      @clients = _.filter @clients, (client) -> 
        client.id() != exitingClient.id()

    advanceTime: () ->
      @time += 1

      for client in @clients
        newStatus = client.advanceTime(@time)
        if newStatus is 'finished'
          @removeClient client

      #console.log "Time #{@time}"
      #console.log @dump()
      #console.log JSON.stringify @dump().clients

    dump: () ->
      data =
        clients: []

      #XXX Add clients to dump

      data.rack = @rack.dump()
      for client in @clients
        data.clients.push client.dump()

      data

  Gym
