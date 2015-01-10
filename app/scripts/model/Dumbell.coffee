angular.module('gymsym').factory 'Dumbell', () ->

  class Dumbell
    @curMaxId: 0

    @getNewId: () ->
      @curMaxId++
      @curMaxId

    @create: (weight) ->
      new Dumbell(weight)

    constructor: (weight) ->
      @props =
        weight: weight
      @uniqId = Dumbell.getNewId()

    id: () ->
      @uniqId

    weight: () ->
      @props.weight

  Dumbell