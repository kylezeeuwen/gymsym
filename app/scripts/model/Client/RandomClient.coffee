angular.module('gymsym').factory 'RandomClient', (BaseClient) ->

  class RandomClient extends BaseClient

    @create: (id,name,program) ->
      new RandomClient id, name, program
      
    returnDumbells: () ->
      while dumbell = @dumbells.shift()
        availableSlots = @rack.getEmptySlots()
        if availableSlots.length > 0
          pick = Math.floor(Math.random() * availableSlots.length)
          @rack.putDumbell availableSlots[pick], dumbell
        else
          throw new Error "Cannot return dumbell #{dumbell}: rack is full"
    
    clientType: 'RandomClient'

  RandomClient