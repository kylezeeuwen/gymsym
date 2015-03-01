app = angular.module 'gymsym'

app.directive 'gymView', ->
  restrict: 'E'
  replace: true
  template: '<div></div>'
  controller: 'GymViewController'
  scope:
    gym: '='
  link: (scope, iElement, iAttrs, controller) ->

    # dimensions
    scope.margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 19.5}
    scope.width = 1000 - scope.margin.right
    scope.height = 150 - scope.margin.top - scope.margin.bottom

    #Create the SVG container and set the origin.
    scope.svg = d3.select('#' + iElement.attr('id')).append('svg')
      .attr('width', scope.width + scope.margin.left + scope.margin.right)
      .attr('height', scope.height + scope.margin.top + scope.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + scope.margin.left + ',' + scope.margin.top + ')')

app.controller 'GymViewController', ($scope, $interval, $timeout) ->

  $scope.clientCoord = (id) ->
    return {
      x: 25 + parseInt(id) * 100
      y: 80
    }

  $scope.rackCoord = (id) ->
    return {
      x: parseInt(id) * 60 + 10
      y: 20
    }

  #XXX TODO rename to getId
  $scope.key = (d) ->
    d.id

  $scope.watchGym = () ->
    #XXX TODO rename dumbellDump
    $scope.gym.dumbellDump()
    #$scope.gym.dump()

  $scope.updateGym = () ->
    gymData = $scope.gym.dump()
    dumbells = $scope.gym.dumbellDump()

    #return unless 'rack' of gymData
    $scope.updateRack gymData.rack
    $scope.updateClients gymData.clients
    $scope.updateDumbells dumbells

  $scope.updateDumbells = (dumbellData) ->

    allDumbells = $scope.svg.selectAll('.dumbell-container')
      .data(dumbellData, $scope.key)

    enteringDumbells = allDumbells.enter().append('g')
      .attr('class', 'dumbell-container')

    enteringDumbells.append('circle')
      .attr('class', 'dumbell')
      .attr('fill', 'black')
      .attr('r', 18)

    enteringDumbells.append('text')
      .attr('class', 'dumbell-text')
      .attr('dx', -8)
      .attr('dy', 5)
      .attr('fill', 'white')
      .text( (d) -> d.weight )


    allDumbells.transition().ease('linear').duration(1000).attr('transform', (d) =>
      console.log "in the transform d is #{JSON.stringify(d,{},2)}"
      
      coords = null
      if d.status is 'rack'
        coords = @rackCoord d.statusId
      else if d.status is 'client'
        coords = @clientCoord d.statusId
        if d.position is 'L'
          coords.x -= 15
        else
          coords.x += 25
      else
        throw new Error "unknown dumbell status #{d.status}"
      
      "translate(#{coords.x},#{coords.y})"
    )
  $scope.updateRack = (rackData) ->

    rackSpaces = $scope.svg.selectAll('.rack-space-container')
      .data(rackData, $scope.key)

    enteringRackSpaces = rackSpaces.enter().append('g')
      .attr('class', 'rack-space-container')
      .attr('transform', (d) =>
        coord = $scope.rackCoord d.index
        return "translate(#{coord.x},#{coord.y})"
      )
    
    enteringRackSpaces.append('circle')
      .attr('class', 'rack-space')
      .attr('r', 25)
      .attr('stroke', 'black')

    enteringRackSpaces.append('text')
      .attr('class', 'rack-label')
      .attr('fill', 'black')
      .attr('dx', -8)
      .attr('dy', 40)
      .text( (d) ->
        d.label
      )

    rackSpaces.select('.rack-space')
      .attr('fill', (d) ->
        if d.weight is null
          'white'
        else
          if d.weight == d.label
            'rgba(0,255,0,0.2)'
          else
            'rgba(255,0,0,0.2)'
      )

  $scope.updateClients = (clientData, time) ->

    clients = $scope.svg.selectAll('.client-container')
      .data(clientData, $scope.key)

    enteringClients = clients.enter().append('g')
      .attr('class', 'client-container')
      .attr('transform', (d) =>
        coord = @clientCoord d.id
        return "translate(#{coord.x},#{coord.y})"
      )

    enteringClients.append('rect')
      .attr('class', 'client-shape')
      .attr('width', 10)
      .attr('height', 40)

    allClientShapes = clients.select('.client-shape')
      .attr('fill', (d) ->
        if d.type is 'RandomClient'
          'red'
        else
          'green'
      )

#    allClientContainers = $scope.clientArea.selectAll('.client-container')
#      .data(clientData, $scope.key)
#      .each( (d) ->      
#
#        clientDumbellData = []
#        for dumbell, index in d.dumbells
#          record = dumbell.dump()
#          record.index = index
#          clientDumbellData.push record
#
#        enteringClientWeightContainers = d3.select(this).selectAll('.client-weights')
#          .data(clientDumbellData, $scope.key)
#          .enter()
#          .append('g')
#          .attr('class', 'client-weight-container')
# 
#        enteringClientWeightContainers.append('circle')
#          .attr('class', 'dumbell')
#          .attr('r', 18)
#
#        enteringClientWeightContainers.append('text')
#          .attr('class', 'dumbell-text')
#          .attr('dx', -8)
#          .attr('dy', 5)
#          .attr('fill', 'white')
#          .text( (d) ->
#            d.weight
#          )
#
#        allClientWeightContainers = d3.select(this).selectAll('.client-weight-container')
#          .attr('transform', (d) ->
#            x = if d.index == 0 then -15 else 10 + 15
#            y = if (time % 2 == d.index) then -2 else 2
#            return 'translate(' + x + ',' + y + ')'
#          )  
#        
#        leavingClientWeightContainers = d3.select(this).selectAll('.client-weight-container')
#          .data(clientDumbellData, $scope.key)
#          .exit().remove()
#      )

  $scope.$watch $scope.watchGym, $scope.updateGym, true
