angular.module('gymsym').factory 'AverageJoeClient', (BaseClient) ->

  class AverageJoeClient extends BaseClient

    @create: (id,name,program) ->
      new AverageJoeClient id, name, program
      
    returnDumbells: () ->
      while dumbell = @dumbells.shift()
        availableCorrectSlots = @rack.getEmptySlotsForDumbell dumbell
        availableSlots = @rack.getEmptySlots()
        if availableCorrectSlots.length > 0
          @returnDumbell availableCorrectSlots[0], dumbell
        else if availableSlots.length > 0
          @returnDumbell availableSlots[0], dumbell
        else
          throw new Error "Cannot return dumbell #{dumbell.weight()}: rack is full"

    clientType: 'AverageJoeClient'

  AverageJoeClient