(function() {
  var app;

  app = angular.module('gymsym');

  app.directive('gymView', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div></div>',
      controller: 'GymViewController',
      scope: {
        gym: '='
      },
      link: function(scope, iElement, iAttrs, controller) {
        scope.margin = {
          top: 19.5,
          right: 19.5,
          bottom: 19.5,
          left: 19.5
        };
        scope.width = 500 - scope.margin.right;
        scope.height = 150 - scope.margin.top - scope.margin.bottom;
        scope.svg = d3.select('#' + iElement.attr('id')).append('svg').attr('width', scope.width + scope.margin.left + scope.margin.right).attr('height', scope.height + scope.margin.top + scope.margin.bottom).append('g').attr('transform', 'translate(' + scope.margin.left + ',' + scope.margin.top + ')');
        return scope.rack = scope.svg.append('g').attr('class', 'rack');
      }
    };
  });

  app.controller('GymViewController', function($scope, $interval, $timeout) {
    $scope.key = function(d) {
      return d.id;
    };
    $scope.watchGym = function() {
      return $scope.gym.dump();
    };
    $scope.updateGym = function(gymData) {
      var AllDumbellText, allDumbellSlots, allRackSpaces, enteringRackSpaces, rackData, rackSpaces;
      if (!(gymData.racks.length > 0)) {
        return;
      }
      rackData = gymData.racks[0];
      rackSpaces = $scope.rack.selectAll('.rack-space').data(rackData, $scope.key);
      enteringRackSpaces = rackSpaces.enter().append('g').attr('class', 'rack-space-container').attr('transform', function(d) {
        var x;
        x = parseInt(d.index) * 60 + 10;
        return 'translate(' + x + ',10)';
      });
      enteringRackSpaces.append('circle').attr('class', 'rack-space').attr('r', 25).attr('stroke', 'black');
      enteringRackSpaces.append('text').attr('class', 'rack-label').attr('fill', 'black').attr('dx', -8).attr('dy', 40).text(function(d) {
        return d.label;
      });
      enteringRackSpaces.append('circle').attr('class', 'dumbell').attr('r', 18);
      enteringRackSpaces.append('text').attr('class', 'dumbell-text').attr('dx', -8).attr('dy', 5).attr('fill', 'white');
      allRackSpaces = $scope.rack.selectAll('.rack-space').data(rackData, $scope.key).attr('fill', function(d) {
        if (d.weight === null) {
          return 'white';
        } else {
          if (d.weight === d.label) {
            return 'rgba(0,255,0,0.2)';
          } else {
            return 'rgba(255,0,0,0.2)';
          }
        }
      });
      allDumbellSlots = $scope.rack.selectAll('.dumbell').data(rackData, $scope.key).attr('fill', function(d) {
        if (d.weight === null) {
          return 'white';
        } else {
          return 'black';
        }
      });
      return AllDumbellText = $scope.rack.selectAll('.dumbell-text').data(rackData, $scope.key).text(function(d) {
        return d.weight;
      });
    };
    return $scope.$watch($scope.watchGym, $scope.updateGym, true);
  });

}).call(this);
