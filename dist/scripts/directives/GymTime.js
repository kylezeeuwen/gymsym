(function() {
  var app;

  app = angular.module('gymsym');

  app.directive('gymTime', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div>Time: {{getTime()}}</div>',
      controller: 'GymTimeController',
      scope: {
        time: '='
      },
      link: function(scope, iElement, iAttrs, controller) {}
    };
  });

  app.controller('GymTimeController', function($scope) {
    $scope.startString = '2000-01-01T00:00:00Z';
    $scope.lastComputedTime = null;
    $scope.getTime = function() {
      if (!$scope.displayIsUpToDate()) {
        $scope.displayString = moment($scope.startString).add($scope.time, 's').zone('+0').format('HH:mm:ss');
        $scope.lastComputedTime = $scope.time;
      }
      return $scope.displayString;
    };
    return $scope.displayIsUpToDate = function() {
      return $scope.lastComputedTime && $scope.lastComputedTime === $scope.time;
    };
  });

}).call(this);
