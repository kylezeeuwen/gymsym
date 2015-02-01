angular.module('gymsym').controller 'MainCtrl', ($scope, Dumbell, Rack, Gym, Client, $timeout, $interval) ->
  $scope.rack1 = Rack.create 5, 5, 10, 10, 15, 15

  $scope.rack1.putDumbell 0, Dumbell.create 10
  $scope.rack1.putDumbell 1, Dumbell.create 10

#  $timeout ->
#    console.log 'adding two more dumbells'
#    $scope.rack1.putDumbell 2, Dumbell.create 10
#    $scope.rack1.putDumbell 3, Dumbell.create 15
#  , 3000
#
#  $timeout ->
#    console.log 'removing dumbell 1'
#    $scope.rack1.takeDumbell 1
#  , 5000
#
#  $timeout ->
#    console.log 'moving dumbell to right slot'
#    $scope.rack1.putDumbell 5, $scope.rack1.takeDumbell(3)
#  , 7000

  $scope.gym = Gym.create()
  $scope.gym.setRack $scope.rack1
  $scope.intervals = {}

  $timeout ->
    $scope.gym.advanceTime()
  , 1000

  $timeout ->
    $scope.gym.advanceTime()
  , 2000

  $timeout ->
    client1 = Client.create 'client1', [
      { name: 'ex1', duration: 3, dumbells: [10] }
      { name: 'ex2', duration: 3, dumbells: [10] }
    ]
    $scope.gym.addClient client1

    $scope.gym.advanceTime()

    $scope.intervals['poop'] = $interval ->
      $scope.gym.advanceTime()
    , 1000

  , 3000

  $timeout ->
    $interval.cancel $scope.intervals['poop']
  , 14000