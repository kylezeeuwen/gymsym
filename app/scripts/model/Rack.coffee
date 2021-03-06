angular.module('gymsym').factory 'Rack', (Dumbell) ->

  class Rack
    @curMaxId: 0

    @getNewId: () ->
      @curMaxId++
      @curMaxId

    @create: (labels...) ->
      new Rack(labels)

    constructor: (labels) ->
      @numSlots = labels.length
      @spaces = (@makeSpace(label) for label in labels)
      @uniqId = Rack.getNewId()

    advanceTime: (time) ->
      @spaces.forEach (space) ->
        space.fresh = false

    makeSpace: (labelText) ->
      label = parseInt labelText
      if isNaN labelText
        throw new Error "invalid label '#{labelText}'"

      return {
        label: label
        dumbell: null
        fresh: false
      }

    id: () ->
      @uniqId

    numSlots: () ->
      @numSlots

    validateSlotIndex: (slotIndex) ->
      if not (typeof slotIndex is 'number')
        throw new Error "invalid slotIndex '#{slotIndex}'"

      if isNaN slotIndex
        throw new Error "invalid slotIndex '#{slotIndex}'"

      if slotIndex < 0 or slotIndex >= @numSlots
        throw new Error "slotIndex '#{slotIndex}' out of range"

    putDumbell: (slotIndexArg,dumbell) ->
      if not (dumbell instanceof Dumbell)
        throw new Error 'invalid dumbell call putDumbell(index,dumbell)'

      slotIndex = parseInt(slotIndexArg)

      @validateSlotIndex slotIndex

      if @spaces[slotIndex]['dumbell']
        throw new Error 'space full'

      @spaces[slotIndex]['dumbell'] = dumbell
      @spaces[slotIndex]['fresh'] = true

    takeFromSlot: (slotIndexArg) ->
      slotIndex = parseInt(slotIndexArg)

      @validateSlotIndex slotIndex

      if not @spaces[slotIndex]['dumbell']
        throw new Error 'space empty'

      dumbell = @spaces[slotIndex]['dumbell']

      @spaces[slotIndex]['dumbell'] = null

      return dumbell

    hasWeights: (requiredWeights) ->
      availableWeights = []
      _.map @spaces, (space) ->
        availableWeights.push space.dumbell.weight() if (space.dumbell and !space.fresh)

      hasAll = true
      for weight in requiredWeights
        index = _.indexOf availableWeights, weight
        if index == -1
          hasAll = false
          break
        else
          availableWeights.splice index, 1

      hasAll

    takeDumbells: (requiredWeights) ->
      dumbells = []
      for weight in requiredWeights
        dumbells.push @takeFirstDumbellWithWeight weight

      dumbells

    # TODO test
    takeFirstDumbellWithWeight: (weight) ->
      indexes = @getSlotIndexesForWeight weight
      unless indexes.length > 0
        throw new Error "cannot takeFirstDumbellWithWeight(#{weight}): no dumbell available"
      @takeFromSlot indexes[0]

    # TODO change weight to dumbell in name of function
    getSlotIndexesForWeight: (weight) ->
      indexes = []
      for index, space of @spaces
        indexes.push(parseInt index) if space.dumbell?.weight() == weight and !space.fresh

      indexes

    getEmptySlotsForDumbell: (dumbell) ->

      if dumbell and not(dumbell instanceof Dumbell)
        throw new 'invalid dumbell: not a Dumbell'

      slots = []
      for space,index in @spaces
        if not space['dumbell']
          if (not dumbell) or dumbell.weight() == space.label
            slots.push index
      slots

    getEmptySlots: () ->
      @getEmptySlotsForDumbell null

    dump: () ->
      id = @id()

      printSpace = (space, index) ->
        spaceData =
          label: space.label
          weight: null
          index: parseInt(index)
          id: "#{id}-#{index}"

        if space.dumbell instanceof Dumbell
          spaceData.weight = space.dumbell.weight()
          #@TODO are both needed?
          spaceData.dumbell = space.dumbell

        spaceData

      data = (printSpace(@spaces[index], index) for index in [0..@numSlots-1])
      data

  Rack
