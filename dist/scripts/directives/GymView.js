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
        scope.width = 1000 - scope.margin.right;
        scope.height = 150 - scope.margin.top - scope.margin.bottom;
        return scope.svg = d3.select('#' + iElement.attr('id')).append('svg').attr('width', scope.width + scope.margin.left + scope.margin.right).attr('height', scope.height + scope.margin.top + scope.margin.bottom).append('g').attr('transform', 'translate(' + scope.margin.left + ',' + scope.margin.top + ')');
      }
    };
  });

  app.controller('GymViewController', function($scope, $interval, $timeout) {
    $scope.clientCoord = function(id) {
      return {
        x: 25 + parseInt(id) * 100,
        y: 80
      };
    };
    $scope.rackCoord = function(id) {
      return {
        x: parseInt(id) * 60 + 10,
        y: 20
      };
    };
    $scope.key = function(d) {
      return d.id;
    };
    $scope.watchGym = function() {
      return $scope.gym.dumbellDump();
    };
    $scope.updateGym = function() {
      var dumbells, gymData;
      gymData = $scope.gym.dump();
      dumbells = $scope.gym.dumbellDump();
      $scope.updateRack(gymData.rack);
      $scope.updateClients(gymData.clients);
      return $scope.updateDumbells(dumbells);
    };
    $scope.updateDumbells = function(dumbellData) {
      var allDumbells, enteringDumbells;
      allDumbells = $scope.svg.selectAll('.dumbell-container').data(dumbellData, $scope.key);
      enteringDumbells = allDumbells.enter().append('g').attr('class', 'dumbell-container');
      enteringDumbells.append('circle').attr('class', 'dumbell').attr('fill', 'black').attr('r', 18);
      enteringDumbells.append('text').attr('class', 'dumbell-text').attr('dx', -8).attr('dy', 5).attr('fill', 'white').text(function(d) {
        return d.weight;
      });
      return allDumbells.transition().ease('linear').duration(1000).attr('transform', (function(_this) {
        return function(d) {
          var coords;
          console.log("in the transform d is " + (JSON.stringify(d, {}, 2)));
          coords = null;
          if (d.status === 'rack') {
            coords = _this.rackCoord(d.statusId);
          } else if (d.status === 'client') {
            coords = _this.clientCoord(d.statusId);
            if (d.position === 'L') {
              coords.x -= 15;
            } else {
              coords.x += 25;
            }
          } else {
            throw new Error("unknown dumbell status " + d.status);
          }
          return "translate(" + coords.x + "," + coords.y + ")";
        };
      })(this));
    };
    $scope.updateRack = function(rackData) {
      var enteringRackSpaces, rackSpaces;
      rackSpaces = $scope.svg.selectAll('.rack-space-container').data(rackData, $scope.key);
      enteringRackSpaces = rackSpaces.enter().append('g').attr('class', 'rack-space-container').attr('transform', (function(_this) {
        return function(d) {
          var coord;
          coord = $scope.rackCoord(d.index);
          return "translate(" + coord.x + "," + coord.y + ")";
        };
      })(this));
      enteringRackSpaces.append('circle').attr('class', 'rack-space').attr('r', 25).attr('stroke', 'black');
      enteringRackSpaces.append('text').attr('class', 'rack-label').attr('fill', 'black').attr('dx', -8).attr('dy', 40).text(function(d) {
        return d.label;
      });
      return rackSpaces.select('.rack-space').attr('fill', function(d) {
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
    };
    $scope.updateClients = function(clientData, time) {
      var allClientShapes, clients, enteringClients;
      clients = $scope.svg.selectAll('.client-container').data(clientData, $scope.key);
      enteringClients = clients.enter().append('g').attr('class', 'client-container').attr('transform', (function(_this) {
        return function(d) {
          var coord;
          coord = _this.clientCoord(d.id);
          return "translate(" + coord.x + "," + coord.y + ")";
        };
      })(this));
      enteringClients.append('rect').attr('class', 'client-shape').attr('width', 10).attr('height', 40);
      return allClientShapes = clients.select('.client-shape').attr('fill', function(d) {
        if (d.type === 'RandomClient') {
          return 'red';
        } else {
          return 'green';
        }
      });
    };
    return $scope.$watch($scope.watchGym, $scope.updateGym, true);
  });

}).call(this);
