angular.module('gymsym').controller 'MainCtrl', ($scope, Dumbell, Rack, Gym, Client, $timeout, $interval) ->
  $scope.rack1 = Rack.create 5, 5, 10, 10, 15, 15

  $scope.rack1.putDumbell 0, Dumbell.create 5
  $scope.rack1.putDumbell 1, Dumbell.create 5
  
  $scope.rack1.putDumbell 2, Dumbell.create 15

  $scope.rack1.putDumbell 4, Dumbell.create 10
  $scope.rack1.putDumbell 5, Dumbell.create 10

  $scope.gym = Gym.create()
  $scope.gym.setRack $scope.rack1
  $scope.intervals = {}
  $scope.intervalLength = 1000

  $scope.intervals['poop'] = $interval ->
    $scope.gym.advanceTime()
  , $scope.intervalLength

  $timeout ->
    $interval.cancel $scope.intervals['poop']
  , 16 * $scope.intervalLength

  $timeout ->
    client1 = Client.create 'client1', [
      { name: 'c1-ex1', duration: 2, dumbells: [10,10] }
      { name: 'c1-ex2', duration: 2, dumbells: [5,5] }
    ]
    $scope.gym.addClient client1
  , 2.5 * $scope.intervalLength

  $timeout ->
    client2 = Client.create 'client2', [
      { name: 'c2-ex1', duration: 2, dumbells: [10] }
      { name: 'c2-ex2', duration: 2, dumbells: [15] }
    ]
    $scope.gym.addClient client2
  , 3.5 * $scope.intervalLength
