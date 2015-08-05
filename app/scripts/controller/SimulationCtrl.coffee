angular.module('gymsym').controller 'SimulationCtrl', ($scope, SimulationDetails, Dumbell, Rack, Gym, Client, $timeout, $interval, SimulationApi) ->

  console.log SimulationDetails

  $scope.intervalLength = 400 #milliseconds #@TODO configurable via UI
  $scope.rackConfig = SimulationDetails.rack
  $scope.clients = SimulationDetails.clients

  #@TODO need visual indication of simulation completion
  $scope.done = false
  inProgress = $interval ->
    currentTime = $scope.gym.advanceTime()
    $scope.checkForNewClients currentTime

    if $scope.firstClientArrived and $scope.gym.clientCount() == 0
      $scope.done = true
      $interval.cancel inProgress

  , $scope.intervalLength

  $scope.init = () ->
    $scope.gym = Gym.create()

    rack = Rack.create $scope.rackConfig...
    $scope.rackConfig.forEach (weight, index) ->
      rack.putDumbell index, Dumbell.create weight
    $scope.gym.setRack rack

  $scope.firstClientArrived = false # @XXX : refactor
  $scope.checkForNewClients = (currentTime) ->
    newClients = $scope.clients.filter (clientData) ->
      clientData.arrival == currentTime

    newClients.forEach (client) ->
      $scope.firstClientArrived = true
      $scope.gym.addClient Client.create client.name, client.type, client.program

  $scope.init()
