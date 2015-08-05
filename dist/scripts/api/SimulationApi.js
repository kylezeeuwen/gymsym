(function() {
  'use strict';
  angular.module('gymsym').factory('SimulationApi', function($resource, $q) {
    var actions;
    actions = {
      get: {
        url: 'data/simulation/:id.json',
        method: 'GET'
      }
    };
    return $resource('', {}, actions);
  });

}).call(this);
