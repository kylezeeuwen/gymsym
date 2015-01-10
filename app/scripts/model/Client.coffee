angular.module('gymsym').factory 'Client', () ->

  class Client
    @curMaxId: 0

    @getNewId: () ->
      @curMaxId++
      @curMaxId

    @create: (name, program) ->
      new Rack(name, program)

    constructor: (name, program) ->
      @props =
        name: name
        program: program
      @uniqId = Client.getNewId()

    id: () ->
      @uniqId

  Client