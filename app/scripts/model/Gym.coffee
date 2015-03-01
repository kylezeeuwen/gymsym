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

    dump: () ->
      data =
        clients: []
        rack: @rack.dump()
        time: @time
        
      for client in @clients
        data.clients.push client.dump()

      data

    dumbellDump: () ->
      data = @dump()

      dumbells = []
      for client in data.clients
        for dumbell, index in client.dumbells
          dumbells.push {
            id: dumbell.uniqId
            weight: dumbell.props.weight
            status: 'client'
            statusId: client.id
            position: if index == 0 then 'L' else 'R'
            xlastStatus: client.xlastStatus
            currentStatus: client.status
          }

      for slot in data.rack
        if slot.dumbell
          dumbells.push {
            id: slot.dumbell.uniqId
            weight: slot.dumbell.props.weight
            status: 'rack'
            statusId: slot.index
          }

      dumbells

  Gym
