angular.module('gymsym').controller 'MainCtrl', ($scope, Dumbell, Rack, Gym, Client, $timeout, $interval) ->

  #TODO: move to config / JSON resource
  $scope.intervalLength = 400 #milliseconds
  $scope.rackConfig = [5, 5, 10, 10, 12, 12, 15, 15, 20, 20, 25, 25, 30, 30]
  $scope.clients = [
    {
      name: 'client1', type: 'AverageJoe', arrival: 5
      program: [
        { name: 'c1-ex1', duration: 6, dumbells: [10,10] }
        { name: 'c1-ex2', duration: 9, dumbells: [5,5] }
        { name: 'c1-ex3', duration: 12, dumbells: [20,20] }
        { name: 'c1-ex1', duration: 12, dumbells: [10,10] }
        { name: 'c1-ex2', duration: 9, dumbells: [25,25] }
        { name: 'c1-ex3', duration: 4, dumbells: [5,5] }
      ]
    }
    {
      name: 'client2', type: 'AverageJoe', arrival: 9
      program: [
        { name: 'c1-ex1', duration: 6, dumbells: [20] }
        { name: 'c1-ex2', duration: 11, dumbells: [10,10] }
        { name: 'c1-ex3', duration: 4, dumbells: [20,20] }
        { name: 'c1-ex4', duration: 5, dumbells: [15,15] }
      ]
    }
    {
      name: 'client3', type: 'Random', arrival: 15
      program: [
        { name: 'c1-ex1', duration: 6, dumbells: [30,30] }
        { name: 'c1-ex2', duration: 9, dumbells: [5,5] }
        { name: 'c1-ex3', duration: 4, dumbells: [10,10] }
      ]
    }
    {
      name: 'client2', type: 'AverageJoe', arrival: 21
      program: [
        { name: 'c1-ex1', duration: 6, dumbells: [20] }
        { name: 'c1-ex2', duration: 11, dumbells: [10,10] }
        { name: 'c1-ex3', duration: 4, dumbells: [20,20] }
        { name: 'c1-ex4', duration: 5, dumbells: [15,15] }
      ]
    }
    {
      name: 'client4', type: 'Random', arrival: 21
      program: [
        { name: 'c1-ex1', duration: 3, dumbells: [30,25] }
        { name: 'c1-ex2', duration: 6, dumbells: [5,5] }
        { name: 'c1-ex3', duration: 13, dumbells: [10,10] }
      ]
    }
  ]

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
