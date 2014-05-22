angular.module('SignalR', [])
.constant('$', $)
.factory('Hub', ['$', function ($) {
	//This will allow same connection to be used for all Hubs
	//It also keeps connection as singleton.
	var globalConnection = $.hubConnection();
	return function (hubName, listeners, methods) {
		var Hub = this;
		Hub.connection = globalConnection;
		Hub.proxy = Hub.connection.createHubProxy(hubName);
		Hub.on = function (event, fn) {
			Hub.proxy.on(event, fn);
		};
		Hub.invoke = function (method, args) {
			return Hub.proxy.invoke.apply(Hub.proxy, arguments)
		};

		if (listeners) {
			angular.forEach(listeners, function (fn, event) {
				Hub.on(event, fn);
			});
		}
		if (methods) {
			angular.forEach(methods, function (method) {
				Hub[method] = function () {
					var args = $.makeArray(arguments);
					args.unshift(method);
					return Hub.invoke.apply(Hub, args);
				};
			});
		}
		//Adding additional property of promise allows to access it in rest of the application.
		Hub.promise = Hub.connection.start();		
		return Hub;
	};
}]);
