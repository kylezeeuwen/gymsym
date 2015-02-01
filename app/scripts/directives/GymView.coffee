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
    scope.width = 500 - scope.margin.right
    scope.height = 150 - scope.margin.top - scope.margin.bottom

    #Create the SVG container and set the origin.
    scope.svg = d3.select('#' + iElement.attr('id')).append('svg')
      .attr('width', scope.width + scope.margin.left + scope.margin.right)
      .attr('height', scope.height + scope.margin.top + scope.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + scope.margin.left + ',' + scope.margin.top + ')')

    scope.rack = scope.svg.append('g')
      .attr('class', 'rack')

    scope.clientArea = scope.svg.append('g')
      .attr('class', 'client-area')
      .attr('transform', 'translate(10,70)')


app.controller 'GymViewController', ($scope, $interval, $timeout) ->

  $scope.key = (d) ->
    d.id

  $scope.watchGym = () ->
    $scope.gym.dump()

  $scope.updateGym = (gymData) ->
    return unless 'rack' of gymData
    $scope.updateRack gymData.rack
    $scope.updateClients gymData.clients

  $scope.updateRack = (rackData) ->

    rackSpaces = $scope.rack.selectAll('.rack-space')
      .data(rackData, $scope.key)

    enteringRackSpaces = rackSpaces.enter().append('g')
      .attr('class', 'rack-space-container')
      .attr('transform', (d) ->
        x = parseInt(d.index) * 60 + 10
        return 'translate(' + x + ',10)'
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

    enteringRackSpaces.append('circle')
      .attr('class', 'dumbell')
      .attr('r', 18)

    enteringRackSpaces.append('text')
      .attr('class', 'dumbell-text')
      .attr('dx', -8)
      .attr('dy', 5)
      .attr('fill', 'white')

    allRackSpaces = $scope.rack.selectAll('.rack-space')
      .data(rackData, $scope.key)
      .attr('fill', (d) ->
        if d.weight is null
          'white'
        else
          if d.weight == d.label
            'rgba(0,255,0,0.2)'
          else
            'rgba(255,0,0,0.2)'
      )

    allDumbellSlots = $scope.rack.selectAll('.dumbell')
      .data(rackData, $scope.key)
      .attr('fill', (d) ->
        if d.weight is null
          'white'
        else
          'black'
      )

    AllDumbellText = $scope.rack.selectAll('.dumbell-text')
      .data(rackData, $scope.key)
      .text( (d) ->
        d.weight
      )

  $scope.updateClients = (clientData) ->

    clients = $scope.clientArea.selectAll('.client-shape')
      .data(clientData, $scope.key)

    enteringClients = clients.enter().append('g')
      .attr('class', 'client-container')
      .attr('transform', (d) ->
        x = d.id * 60 + 10
        return 'translate(' + x + ',10)'
      )

    enteringClients.append('rect')
      .attr('class', 'client-shape')
      .attr('width', 10)
      .attr('height', 10)
      .attr('style', "stroke-width:3;stroke:rgb(0,0,0)")

    allClients = $scope.clientArea.selectAll('.client-shape')
      .data(clientData, $scope.key)
      .attr('fill', (d) ->
        if d.status is 'idle'
          'green'
        else if d.status is 'exercising'
          'orange'
      )


  $scope.$watch $scope.watchGym, $scope.updateGym, true
