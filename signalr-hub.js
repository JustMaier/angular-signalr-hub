angular.module('SignalR', [])
.constant('$', window.jQuery)
.factory('Hub', ['$', function ($) {
	//This will allow same connection to be used for all Hubs
	//It also keeps connection as singleton.
	var globalConnections = [];

	function initNewConnection(options) {
		var connection = null;
		if (options && options.rootPath) {
			connection = $.hubConnection(options.rootPath, { useDefaultPath: false });
		} else {
			connection = $.hubConnection();
		}

		connection.logging = (options && options.logging ? true : false);
		return connection;
	}

	function getConnection(options) {
		var useSharedConnection = !(options && options.useSharedConnection === false);
		if (useSharedConnection) {
			return typeof globalConnections[options.rootPath] === 'undefined' ?
			globalConnections[options.rootPath] = initNewConnection(options) :
			globalConnections[options.rootPath];
		}
		else {
			return initNewConnection(options);
		}
	}

	return function (hubName, options) {
		var Hub = this;

		Hub.connection = getConnection(options);
		Hub.proxy = Hub.connection.createHubProxy(hubName);

		Hub.on = function (event, fn) {
			Hub.proxy.on(event, fn);
		};
		Hub.invoke = function (method, args) {
			return Hub.proxy.invoke.apply(Hub.proxy, arguments)
		};
		Hub.disconnect = function () {
			Hub.connection.stop();
		};
		Hub.connect = function (queryParams) {
			var startOptions = {};
			if(options.transport) startOptions.transport = options.transport;
			if(options.jsonp) startOptions.jsonp = options.jsonp;
            if (queryParams) Hub.connection.qs = queryParams;
			return Hub.connection.start(startOptions);
		};

		if (options && options.listeners) {
			Object.getOwnPropertyNames(options.listeners)
			.filter(function (propName) {
		        	return typeof options.listeners[propName] === 'function';})
		        .forEach(function (propName) {
		        	Hub.on(propName, options.listeners[propName]);
		    	});
		}
		if (options && options.methods) {
			angular.forEach(options.methods, function (method) {
				Hub[method] = function () {
					var args = $.makeArray(arguments);
					args.unshift(method);
					return Hub.invoke.apply(Hub, args);
				};
			});
		}
		if (options && options.queryParams) {
			Hub.connection.qs = options.queryParams;
		}
		if (options && options.errorHandler) {
			Hub.connection.error(options.errorHandler);
		}
		if (options && options.stateChanged) {
		    Hub.connection.stateChanged(options.stateChanged);
		}

		//Adding additional property of promise allows to access it in rest of the application.
		Hub.promise = Hub.connect();
		return Hub;
	};
}]);

// Common.js package manager support (e.g. ComponentJS, WebPack)
if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
  module.exports = 'SignalR';
}
