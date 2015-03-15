(function() {
  var app;

  app = angular.module('gymsym');

  app.directive('gymFlipTime', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div id="flipping"></div>',
      controller: 'GymFlipTimeController',
      scope: {
        time: '='
      },
      link: function(scope, iElement, iAttrs, controller) {
        return scope.stuff = new FlipClock($('#flipping'));
      }
    };
  });

  app.controller('GymFlipTimeController', function($scope) {
    return $scope.startString = '2000-01-01T00:00:00Z';
  });

}).call(this);
