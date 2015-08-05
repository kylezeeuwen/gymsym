(function() {
  'use strict';
  angular.module('gymsym', ['ngResource', 'ui.router']).config(function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.when('', '/intro');
    $urlRouterProvider.otherwise('/intro');
    $stateProvider.state('simulation', {
      url: '/simulation/:simulationId',
      templateUrl: 'views/simulation.html',
      resolve: {
        SimulationDetails: [
          '$stateParams', 'SimulationApi', function($stateParams, SimulationApi) {
            return SimulationApi.get({
              id: $stateParams.simulationId
            }).$promise;
          }
        ]
      },
      controller: 'SimulationCtrl'
    });
    $stateProvider.state('intro', {
      url: '/intro',
      templateUrl: 'views/intro.html'
    });
  });

}).call(this);
