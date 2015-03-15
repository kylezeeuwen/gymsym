(function() {
  'use strict';
  angular.module('gymsym', ['ui.router']).config(function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.when('', '/main');
    $urlRouterProvider.otherwise('/main');
    $stateProvider.state('main', {
      url: '/main',
      views: {
        body: {
          templateUrl: 'views/main.html'
        }
      }
    });
    $stateProvider.state('simple', {
      url: '/simple',
      views: {
        body: {
          templateUrl: 'views/simple.html'
        }
      }
    });
  });

}).call(this);
