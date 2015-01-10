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
      @uniqId = Gym.getNewId()

    id: () ->
      @uniqId

    addRack: (rack) ->
      @racks.push rack

    dump: () ->
      data =
        racks: []

      for rack in @racks
        data.racks.push rack.dump()

      data

  Gym
