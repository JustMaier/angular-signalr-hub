(function() {

'use strict';

describe('SignalR Client', function() {
  it('should have jquery available', function() {
    expect($).toBeDefined();
  });


  it('should be available', function() {
    expect($.signalR).toBeDefined();
  });

  it('should have connection', function() {
    expect($.connection).toBeDefined();
  });

  it('should have hub connection', function() {
    expect($.hubConnection).toBeDefined();
  });
});

})();