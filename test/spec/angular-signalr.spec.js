(function() {

  'use strict';

  describe('HubFactory', function () {

    // load the factory's module
    beforeEach(module('SignalR'));

    var HubFactory, scope;

    // Initialize the factory and a mock scope
    beforeEach(inject(function (_HubFactory_, $rootScope) {
      scope = $rootScope.$new();
      HubFactory = _HubFactory_;
    }));

    it('should have a getHub method', function () {
      expect(HubFactory.getHub).toBeDefined();
    });



    describe('Hub creation basics', function () {
      var hub;
      var hubName = 'test';

      beforeEach(function() {
        hub = HubFactory.getHub(hubName);
      });
    
      afterEach(function() {
        hub.disconnect();
      });

      it('should return a new Hub instance', function() {
        var hub = HubFactory.getHub('test');
        expect(hub).toBeDefined();
      });

      it('should have a connection property', function() {
        var hub = HubFactory.getHub('test');
        expect(hub.connection).toBeDefined();
      });

      it('should have a proxy property', function() {
        expect(hub.proxy).toBeDefined();
      });

      it('should have a proxu with the expected hub name', function() {
        expect(hub.proxy.hubName).toEqual(hubName);
      });

    });



    describe('Hub with no options specified', function () {
      var hub;
      var hubName = 'test';

      beforeEach(function() {
        hub = HubFactory.getHub(hubName);
      });

      afterEach(function() {
        hub.disconnect();
      });

      describe('Hub.connection', function () {

        it('should have the default url', function() {
          expect(hub.connection.url).toEqual('/signalr');
        });

        it('should have logging disabled', function() {
          expect(hub.connection.logging).toBeFalsy();
        });

        it('should have a start connection promise', function() {
          expect(hub.promise).toBeDefined();
        });

        it('should be trying to connect', function() {
          expect(hub.connection.state).toEqual($.signalR.connectionState.connecting);
        });

      });

    });



    describe('Hub with logging enabled specified', function () {
      var hub;
      var hubName = 'test';

      beforeEach(function() {
        hub = HubFactory.getHub(hubName, { logging: true });
      });

      afterEach(function() {
        hub.disconnect();
      });

      describe('Hub.connection', function () {

        it('should have the default url', function() {
          expect(hub.connection.url).toEqual('/signalr');
        });

        it('should have logging enabled', function() {
          expect(hub.connection.logging).toBeTruthy();
        });

        it('should have a start connection promise', function() {
          expect(hub.promise).toBeDefined();
        });

        it('should be trying to connect', function() {
          expect(hub.connection.state).toEqual($.signalR.connectionState.connecting);
        });

      });

    });



    describe('Hub with rootPath specified', function () {
      var hub;
      var hubName = 'test';

      beforeEach(function() {
        hub = HubFactory.getHub(hubName, { rootPath: '/customRootPath' });
      });

      afterEach(function() {
        hub.disconnect();
      });

      describe('Hub.connection', function () {

        it('should have a custom root path', function() {
          expect(hub.connection.url).toEqual('/customRootPath');
        });

        it('should have logging disabled', function() {
          expect(hub.connection.logging).toBeFalsy();
        });

        it('should have a start connection promise', function() {
          expect(hub.promise).toBeDefined();
        });

        it('should be trying to connect', function() {
          expect(hub.connection.state).toEqual($.signalR.connectionState.connecting);
        });

      });

    });



    describe('Hub with methods specified', function () {
      var hub;
      var hubName = 'test';

      beforeEach(function() {
        hub = HubFactory.getHub(hubName, {
          methods: [
            'testMethod',
            'anotherTestMethod'
          ]
        });
      });

      afterEach(function() {
        hub.disconnect();
      });

      it('should attach methods to hub', function () {
        expect(hub.testMethod).toBeDefined();
        expect(hub.anotherTestMethod).toBeDefined();
      });

    });


    describe('Hub with useSharedConnection enabled specified', function () {

      it('should create multiple hubs with same connection', function () {
        var hub1 = HubFactory.getHub('test1', { useSharedConnection: true });
        var hub2 = HubFactory.getHub('test2');
        expect(hub1.connection).toEqual(hub2.connection);
      });

    });


    describe('Hub with useSharedConnection disabled specified', function () {

      it('should create multiple hubs with same connection', function () {
        var hub1 = HubFactory.getHub('test1', { useSharedConnection: false });
        var hub2 = HubFactory.getHub('test2', { useSharedConnection: false });
        expect(hub1.connection).toNotEqual(hub2.connection);
      });

    });


  });

})();