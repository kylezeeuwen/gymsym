angular.module('gymsym').factory 'Client', (AverageJoeClient, RandomClient) ->

  class Client
    @curMaxId: -1

    @getNewId: () ->
      @curMaxId++
      @curMaxId

    @getClientClass: (type) ->
      types =
        AverageJoe: AverageJoeClient
        Random: RandomClient

      clientClass = types[type]
      throw new Error "Invalid client type #{type}" unless clientClass
      
      clientClass
    
    @create: (name, type, program) ->
      newId = Client.getNewId()
      Client.getClientClass(type).create(newId, name, program)

  Client
