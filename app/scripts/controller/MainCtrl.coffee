angular.module('gymsym').controller 'MainCtrl', ($scope, Dumbell, Rack, Gym, $timeout) ->
  $scope.rack1 = Rack.create 5, 5, 10, 10, 15, 15

  $scope.rack1.putDumbell 0, Dumbell.create 10
  $scope.rack1.putDumbell 1, Dumbell.create 10

  $timeout ->
    console.log 'adding two more dumbells'
    $scope.rack1.putDumbell 2, Dumbell.create 10
    $scope.rack1.putDumbell 3, Dumbell.create 15
  , 3000

  $timeout ->
    console.log 'removing dumbell 1'
    $scope.rack1.takeDumbell 1
  , 5000

  $timeout ->
    console.log 'moving dumbell to right slot'
    $scope.rack1.putDumbell 5, $scope.rack1.takeDumbell(3)
  , 7000

  $scope.gym = Gym.create()
  $scope.gym.addRack $scope.rack1
