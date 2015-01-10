
describe 'DumbellSpec:', ->

  beforeEach -> 
    window.angular.mock.module 'gymsym'
  
  beforeEach inject (_Dumbell_) ->
    @Dumbell = _Dumbell_

  describe 'constructor:', ->
    beforeEach ->
      @dumbell = new @Dumbell(5)

    it 'sets weight', ->
      expect(@dumbell.weight()).toBe 5

    it 'increments the id', ->
      @dumbell2 = new @Dumbell(10)
      expect(@dumbell.id()).toBe 1
      expect(@dumbell2.id()).toBe 2
     
