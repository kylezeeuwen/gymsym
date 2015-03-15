app = angular.module 'gymsym'

app.directive 'gymTime', ->
  restrict: 'E'
  replace: true
  template: '<div>Time: {{getTime()}}</div>'
  controller: 'GymTimeController'
  scope:
    time: '='
  link: (scope, iElement, iAttrs, controller) ->

app.controller 'GymTimeController', ($scope) ->
  $scope.startString = '2000-01-01T00:00:00Z'
  $scope.lastComputedTime = null

  $scope.getTime = () ->
    if not $scope.displayIsUpToDate()
      $scope.displayString = moment($scope.startString).add($scope.time, 's').zone('+0').format('HH:mm:ss')
      $scope.lastComputedTime = $scope.time
    $scope.displayString

  $scope.displayIsUpToDate = () ->
    $scope.lastComputedTime && $scope.lastComputedTime is $scope.time