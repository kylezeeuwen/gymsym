(function() {
  angular.module('gymsym').controller('SimpleCtrl', function($scope, Dumbell, Rack, Gym, Client, $timeout, $interval) {
    $scope.duration = 4;
    $scope.intervalLength = 3000;
    $scope.rack1 = Rack.create(5, 10);
    $scope.rack1.putDumbell(0, Dumbell.create(5));
    $scope.rack1.putDumbell(1, Dumbell.create(10));
    $scope.gym = Gym.create();
    $scope.gym.setRack($scope.rack1);
    $scope.intervals = {};
    $scope.intervals['main'] = $interval(function() {
      $scope.gym.advanceTime();
      return console.log("Gym Time is now : " + $scope.gym.time);
    }, $scope.intervalLength);
    $timeout(function() {
      return $interval.cancel($scope.intervals['main']);
    }, $scope.duration * $scope.intervalLength);
    return $timeout(function() {
      var client1;
      client1 = Client.create('client1', 'Random', [
        {
          name: 'c1-ex1',
          duration: 2,
          dumbells: [5]
        }
      ]);
      return $scope.gym.addClient(client1);
    }, 0.5 * $scope.intervalLength);
  });

}).call(this);
