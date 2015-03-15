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

    # @TODO split into listAllClients and listAllRacks
    dump: () ->
      data =
        clients: []
        rack: @rack.dump()
        time: @time
        
      for client in @clients
        data.clients.push client.dump()

      data

    listAllDumbells: () ->
      data = @dump()

      dumbells = []

      for client in @clients
        for dumbell, index in client.getDumbells()
          hand = 
          dumbells.push {
            id: dumbell.id()
            status: 'client'
            hand: if index == 0 then 'L' else 'R'
            client: client
            dumbell: dumbell
            weight: dumbell.props.weight
          }

      for slot in data.rack
        if slot.dumbell
          dumbells.push {
            id: slot.dumbell.id()
            status: 'rack'
            slotIndex: slot.index
            dumbell: slot.dumbell
            weight: slot.dumbell.props.weight
          }

      dumbells

  Gym
