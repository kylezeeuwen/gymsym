app = angular.module 'gymsym'

app.directive 'gymView', ->
  restrict: 'E'
  replace: true
  template: '<div></div>'
  controller: 'GymViewController'
  scope:
    gym: '='
    intervalLength: '='
  link: (scope, iElement, iAttrs, controller) ->

    # dimensions
    scope.margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 19.5}
    scope.width = 1000 - scope.margin.right
    scope.height = 200 - scope.margin.top - scope.margin.bottom

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
      y: 120
    }

  $scope.rackCoord = (id) ->
    return {
      x: 10 + parseInt(id) * 60
      y: 20
    }

  $scope.getId = (d) ->
    d.id

  $scope.watchGym = () ->
    $scope.gym.time

  $scope.updateGym = () ->
    gymData = $scope.gym.dump()
    dumbells = $scope.gym.listAllDumbells()

    #return unless 'rack' of gymData
    $scope.updateRack gymData.rack
    $scope.updateClients gymData.clients
    $scope.updateDumbells dumbells

  $scope.updateDumbells = (dumbellData) ->

    allDumbells = $scope.svg.selectAll('.dumbell-container')
      .data(dumbellData, $scope.getId)

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
      .text( (d) -> d.dumbell.weight() )

    #@TODO this should only apply to dumbells in transition, not all dumbells
    allDumbells
      .transition()
      .ease('linear')
      .duration($scope.intervalLength)
      .attr('transform', (d) =>
                
        #@TODO this is config
        rangeOfCornyMotion = 10

        coord = null
        if d.status is 'rack'
          coord = @rackCoord d.slotIndex

        else if d.status is 'client'

          coord = @clientCoord d.client.id()
          console.log "calling cornyModifier on dumbell #{d.id}"
          cornyModifiers = d.client.cornyMotion $scope.gym.time
          if d.hand is 'L'
            coord.x -= 15
            coord.y += cornyModifiers['L']['y'] * rangeOfCornyMotion
            coord.x += cornyModifiers['L']['x'] * rangeOfCornyMotion
          else if d.hand is 'R'
            coord.x += 25
            coord.y += cornyModifiers['R']['y'] * rangeOfCornyMotion
            coord.x += cornyModifiers['R']['x'] * rangeOfCornyMotion
          else
            throw new Error "unknown dumbell position #{d.position}"
        else
          throw new Error "unknown dumbell status #{d.status}"
        
        "translate(#{coord.x},#{coord.y})"
      )
      .each('start', (d) ->
        d3.select(this).classed({
          'client': false
          'rack': false
          'tranitioning': true
        })
      )
      .each('end', (d) ->
        if d.status is 'client'
          d3.select(this).classed({
            'client': true
            'rack': false
            'tranitioning': false
          })
        else if d.status is 'rack'
          d3.select(this).classed({
            'client': false
            'rack': true
            'tranitioning': false
          })
      )

  $scope.updateRack = (rackData) ->

    rackSpaces = $scope.svg.selectAll('.rack-space-container')
      .data(rackData, $scope.getId)

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
            'rgba(0,255,0,0.2)' #translucent green @TODO use classes instead
          else
            'rgba(255,0,0,0.2)' #translucent red @TODO use classes instead
      )

  $scope.updateClients = (clientData, time) ->

    clients = $scope.svg.selectAll('.client-container')
      .data(clientData, $scope.getId)

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
      .attr('fill', (d) ->
        if d.type is 'RandomClient'
          'red'
        else
          'green'
      )

  $scope.$watch $scope.watchGym, $scope.updateGym, true
