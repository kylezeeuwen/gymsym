(function() {
  angular.module('gymsym').controller('MainCtrl', function($scope, Dumbell, Rack, Gym, Client, $timeout, $interval) {
    $scope.rack1 = Rack.create(5, 5, 10, 10, 15, 15);
    $scope.rack1.putDumbell(0, Dumbell.create(5));
    $scope.rack1.putDumbell(1, Dumbell.create(5));
    $scope.rack1.putDumbell(4, Dumbell.create(10));
    $scope.rack1.putDumbell(5, Dumbell.create(10));
    $scope.gym = Gym.create();
    $scope.gym.setRack($scope.rack1);
    $scope.intervals = {};
    $scope.intervalLength = 500;
    $scope.intervals['poop'] = $interval(function() {
      return $scope.gym.advanceTime();
    }, $scope.intervalLength);
    $timeout(function() {
      return $interval.cancel($scope.intervals['poop']);
    }, 12 * $scope.intervalLength);
    return $timeout(function() {
      var client1;
      client1 = Client.create('client1', [
        {
          name: 'ex1',
          duration: 2,
          dumbells: [10, 10]
        }, {
          name: 'ex2',
          duration: 2,
          dumbells: [5, 5]
        }
      ]);
      return $scope.gym.addClient(client1);
    }, 2.5 * $scope.intervalLength);
  });

}).call(this);
