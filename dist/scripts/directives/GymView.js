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
        gym: '=',
        intervalLength: '='
      },
      link: function(scope, iElement, iAttrs, controller) {
        scope.margin = {
          top: 19.5,
          right: 19.5,
          bottom: 19.5,
          left: 19.5
        };
        scope.width = 1000 - scope.margin.right;
        scope.height = 200 - scope.margin.top - scope.margin.bottom;
        return scope.svg = d3.select('#' + iElement.attr('id')).append('svg').attr('width', scope.width + scope.margin.left + scope.margin.right).attr('height', scope.height + scope.margin.top + scope.margin.bottom).append('g').attr('transform', 'translate(' + scope.margin.left + ',' + scope.margin.top + ')');
      }
    };
  });

  app.controller('GymViewController', function($scope, $interval, $timeout) {
    $scope.clientCoord = function(id) {
      return {
        x: 25 + parseInt(id) * 100,
        y: 120
      };
    };
    $scope.rackCoord = function(id) {
      return {
        x: 10 + parseInt(id) * 60,
        y: 20
      };
    };
    $scope.getId = function(d) {
      return d.id;
    };
    $scope.watchGym = function() {
      return $scope.gym.time;
    };
    $scope.updateGym = function() {
      var dumbells, gymData;
      gymData = $scope.gym.dump();
      dumbells = $scope.gym.listAllDumbells();
      $scope.updateRack(gymData.rack);
      $scope.updateClients(gymData.clients);
      return $scope.updateDumbells(dumbells);
    };
    $scope.updateDumbells = function(dumbellData) {
      var allDumbells, enteringDumbells;
      allDumbells = $scope.svg.selectAll('.dumbell-container').data(dumbellData, $scope.getId);
      enteringDumbells = allDumbells.enter().append('g').attr('class', 'dumbell-container');
      enteringDumbells.append('circle').attr('class', 'dumbell').attr('fill', 'black').attr('r', 18);
      enteringDumbells.append('text').attr('class', 'dumbell-text').attr('dx', -8).attr('dy', 5).attr('fill', 'white').text(function(d) {
        return d.dumbell.weight();
      });
      return allDumbells.transition().ease('linear').duration($scope.intervalLength).attr('transform', (function(_this) {
        return function(d) {
          var coord, cornyModifiers, rangeOfCornyMotion;
          rangeOfCornyMotion = 10;
          coord = null;
          if (d.status === 'rack') {
            coord = _this.rackCoord(d.slotIndex);
          } else if (d.status === 'client') {
            coord = _this.clientCoord(d.client.id());
            cornyModifiers = d.client.cornyMotion($scope.gym.time);
            if (d.hand === 'L') {
              coord.x -= 15;
              coord.y += cornyModifiers['L']['y'] * rangeOfCornyMotion;
              coord.x += cornyModifiers['L']['x'] * rangeOfCornyMotion;
            } else if (d.hand === 'R') {
              coord.x += 25;
              coord.y += cornyModifiers['R']['y'] * rangeOfCornyMotion;
              coord.x += cornyModifiers['R']['x'] * rangeOfCornyMotion;
            } else {
              throw new Error("unknown dumbell position " + d.position);
            }
          } else {
            throw new Error("unknown dumbell status " + d.status);
          }
          return "translate(" + coord.x + "," + coord.y + ")";
        };
      })(this)).each('start', function(d) {
        return d3.select(this).classed({
          'client': false,
          'rack': false,
          'tranitioning': true
        });
      }).each('end', function(d) {
        if (d.status === 'client') {
          return d3.select(this).classed({
            'client': true,
            'rack': false,
            'tranitioning': false
          });
        } else if (d.status === 'rack') {
          return d3.select(this).classed({
            'client': false,
            'rack': true,
            'tranitioning': false
          });
        }
      });
    };
    $scope.updateRack = function(rackData) {
      var enteringRackSpaces, rackSpaces;
      rackSpaces = $scope.svg.selectAll('.rack-space-container').data(rackData, $scope.getId);
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
      var clients, enteringClients, exitingClients;
      clients = $scope.svg.selectAll('.client-container').data(clientData, $scope.getId);
      enteringClients = clients.enter().append('g').attr('class', 'client-container').attr('transform', (function(_this) {
        return function(d) {
          var coord;
          coord = _this.clientCoord(d.id);
          return "translate(" + coord.x + "," + coord.y + ")";
        };
      })(this));
      enteringClients.append('rect').attr('class', 'client-shape').attr('width', 10).attr('height', 40).attr('fill', function(d) {
        if (d.type === 'RandomClient') {
          return 'red';
        } else {
          return 'green';
        }
      });
      enteringClients.append('text').attr('class', 'client-status').attr('dx', -20).attr('dy', 55);
      clients.select('.client-status').text(function(d) {
        switch (d.status) {
          case 'idle':
            return 'resting';
          case 'exercising':
            return '';
          case 'waiting':
            return 'angry!';
        }
      });
      return exitingClients = clients.exit().remove();
    };
    return $scope.$watch($scope.watchGym, $scope.updateGym, true);
  });

}).call(this);
