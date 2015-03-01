'use strict'

angular.module('gymsym').factory 'SimulationApi', ($resource, $q) ->

  actions =
    get:
      url: '/data/simulation/:id.json'
      method: 'GET'

  $resource '', {}, actions
