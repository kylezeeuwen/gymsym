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
  });

}).call(this);
