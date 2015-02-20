angular.module('gymsym').factory 'RandomClient', (Client) ->

  class RandomClient extends Client

    @create: (name, program) ->
      new RandomClient(name, program)

    returnDumbells: () ->
      while dumbell = @dumbells.shift()
        availableSlots = @rack.getEmptySlots()
        if availableSlots.length > 0
          pick = Math.floor(Math.random() * availableSlots.length)
          @rack.putDumbell availableSlots[pick], dumbell
        else
          throw new Error "Cannot return dumbell #{dumbell}: rack is full"
    
    #@TODO I dont need to extend this just override constructor or some @type field in base class
    type: () ->
      'RandomClient'

  RandomClient