angular.module('gymsym').controller 'MainCtrl', ($scope, Dumbell, Rack, Gym, Client, $timeout, $interval) ->
  
  $scope.duration = 60 * 38
  $scope.intervalLength = 20 #milliseconds

  $scope.rack1 = Rack.create 5, 5, 10, 10, 12, 12, 15, 15, 20, 20, 25, 25, 30, 30

  $scope.rack1.putDumbell 0, Dumbell.create 5
  $scope.rack1.putDumbell 1, Dumbell.create 5
  
  $scope.rack1.putDumbell 2, Dumbell.create 10
  $scope.rack1.putDumbell 3, Dumbell.create 10

  $scope.rack1.putDumbell 4, Dumbell.create 12
  $scope.rack1.putDumbell 5, Dumbell.create 12

  $scope.rack1.putDumbell 6, Dumbell.create 15
  $scope.rack1.putDumbell 7, Dumbell.create 15

  $scope.rack1.putDumbell 8, Dumbell.create 20
  $scope.rack1.putDumbell 9, Dumbell.create 20

  $scope.rack1.putDumbell 10, Dumbell.create 25
  $scope.rack1.putDumbell 11, Dumbell.create 25

  $scope.rack1.putDumbell 12, Dumbell.create 30
  $scope.rack1.putDumbell 13, Dumbell.create 30

  $scope.gym = Gym.create()
  $scope.gym.setRack $scope.rack1
  $scope.intervals = {}

  $scope.intervals['main'] = $interval ->
    $scope.gym.advanceTime()
  , $scope.intervalLength

  $timeout ->
    $interval.cancel $scope.intervals['main']
  , $scope.duration * $scope.intervalLength

  $timeout ->
    client1 = Client.create 'client1', 'Random', [
      { name: 'c1-ex1', duration: 600, dumbells: [10,10] }
      { name: 'c1-ex2', duration: 900, dumbells: [5,5] }
      { name: 'c1-ex3', duration: 450, dumbells: [20,20] }
    ]
    $scope.gym.addClient client1
  , 10 * $scope.intervalLength

  $timeout ->
    client2 = Client.create 'client2', 'AverageJoe', [
      { name: 'c2-ex1', duration: 300, dumbells: [10] }
      { name: 'c2-ex2', duration: 60, dumbells: [25, 25] }
      { name: 'c2-ex3', duration: 1200, dumbells: [15] }
    ]
    $scope.gym.addClient client2
  , 70 * $scope.intervalLength

  $timeout ->
    client3 = Client.create 'client3', 'AverageJoe', [
      { name: 'c3-ex1', duration: 1200, dumbells: [30] }
      { name: 'c3-ex2', duration: 600, dumbells: [12, 12] }
    ]
    $scope.gym.addClient client3
  , 110 * $scope.intervalLength

  $timeout ->
    client4 = Client.create 'client4', 'AverageJoe', [
      { name: 'c4-ex1', duration: 100, dumbells: [5] }
      { name: 'c4-ex2', duration: 500, dumbells: [25, 25] }
      { name: 'c4-ex3', duration: 200, dumbells: [15, 15] }
      { name: 'c4-ex4', duration: 600, dumbells: [30] }
    ]
    $scope.gym.addClient client4
  , 180 * $scope.intervalLength
