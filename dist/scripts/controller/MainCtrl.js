(function() {
  angular.module('gymsym').controller('MainCtrl', function($scope, Dumbell, Rack, Gym, Client, $timeout, $interval) {
    $scope.rack1 = Rack.create(5, 5, 10, 10, 15, 15);
    $scope.rack1.putDumbell(0, Dumbell.create(10));
    $scope.rack1.putDumbell(1, Dumbell.create(10));
    $scope.gym = Gym.create();
    $scope.gym.addRack($scope.rack1);
    $scope.intervals = {};
    $timeout(function() {
      return $scope.gym.advanceTime();
    }, 1000);
    $timeout(function() {
      return $scope.gym.advanceTime();
    }, 2000);
    $timeout(function() {
      var client1;
      client1 = Client.create('client1', [
        {
          name: 'ex1',
          duration: 3,
          dumbells: [10]
        }, {
          name: 'ex2',
          duration: 3,
          dumbells: [10]
        }
      ]);
      $scope.gym.addClient(client1);
      $scope.gym.advanceTime();
      return $scope.intervals['poop'] = $interval(function() {
        return $scope.gym.advanceTime();
      }, 1000);
    }, 3000);
    return $timeout(function() {
      return $interval.cancel($scope.intervals['poop']);
    }, 11000);
  });

}).call(this);
