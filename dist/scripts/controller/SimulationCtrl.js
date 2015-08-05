(function() {
  angular.module('gymsym').controller('SimulationCtrl', function($scope, SimulationDetails, Dumbell, Rack, Gym, Client, $timeout, $interval, SimulationApi) {
    var inProgress;
    Client.resetIdCounter();
    $scope.intervalLength = 400;
    $scope.rackConfig = SimulationDetails.rack;
    $scope.clients = SimulationDetails.clients;
    $scope.done = false;
    inProgress = $interval(function() {
      var currentTime;
      currentTime = $scope.gym.advanceTime();
      $scope.checkForNewClients(currentTime);
      if ($scope.firstClientArrived && $scope.gym.clientCount() === 0) {
        $scope.done = true;
        return $interval.cancel(inProgress);
      }
    }, $scope.intervalLength);
    $scope.init = function() {
      var rack;
      $scope.gym = Gym.create();
      rack = Rack.create.apply(Rack, $scope.rackConfig);
      $scope.rackConfig.forEach(function(weight, index) {
        return rack.putDumbell(index, Dumbell.create(weight));
      });
      return $scope.gym.setRack(rack);
    };
    $scope.firstClientArrived = false;
    $scope.checkForNewClients = function(currentTime) {
      var newClients;
      newClients = $scope.clients.filter(function(clientData) {
        return clientData.arrival === currentTime;
      });
      return newClients.forEach(function(client) {
        $scope.firstClientArrived = true;
        return $scope.gym.addClient(Client.create(client.name, client.type, client.program));
      });
    };
    return $scope.init();
  });

}).call(this);
