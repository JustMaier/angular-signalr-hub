(function() {

'use strict';

describe('HubFactory', function () {

  // load the factory's module
  beforeEach(module('SignalR'));

  var HubFactory, scope;

  // Initialize the factory and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    //MainCtrl = $controller('MainCtrl', {
    //  $scope: scope
    //});
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  });
});

})();