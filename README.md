angular-signalr-hub
=======================

A handy wrapper for SignalR Hubs. Just specify the hub name, listening functions, and methods that you're going to use.

##Installation

####Bower
`bower install angular-signalr-hub`

####Nuget
`install-package AngularJs.SignalR.Hub`

####Manually

`<script type="text/javascript" src="js/signalr-hub.js"></script>`

##Usage

1. Include the `signalr-hub.js` script provided by this component into your app
2. add `SignalR` as a module dependency to your app
3. Call new Hub with two parameters

```javascript
var hub = new Hub('hubname',options);
```

####Javascript

```javascript
angular.module('app',['SignalR'])
.factory('Employees',['$rootScope','Hub', '$timeout', function($rootScope, Hub, $timeout){

	//declaring the hub connection
	var hub = new Hub('employee', {
	
		//client side methods
		listeners:{
			'lockEmployee': function (id) {
				var employee = find(id);
				employee.Locked = true;
				$rootScope.$apply();
			},
			'unlockEmployee': function (id) {
				var employee = find(id);
				employee.Locked = false;
				$rootScope.$apply();
			}
		},
		
		//server side methods
		methods: ['lock','unlock'],
		
		//query params sent on initial connection
		queryParams:{
			'token': 'exampletoken'
		},

		//handle connection error
		errorHandler: function(error){
			console.error(error);
		},
		
		//specify a non default root
		//rootPath: '/api
		
		hubDisconnected: function () {                
			if (hub.connection.lastError) {
					hub.connection.start()
					.done(function () {
						if (hub.connection.state == 0)
								$timeout(function () { //your code here }, 2000);
						else{
								//your code here
						})
					.fail(function (reason) {
						console.log(reason);
				}
				);
			}
		}
	});

	var edit = function (employee) {
		hub.lock(employee.Id); //Calling a server method
	};
	var done = function (employee) {
		hub.unlock(employee.Id); //Calling a server method
	}

	return {
		editEmployee: edit,
		doneWithEmployee: done
	};
}]);
```
##Options

* `listeners` client side callbacks
* `methods`  a string array of server side methods which the client can call
* `rootPath` sets the root path for the signalR web service
* `queryParams` object representing additional query params to be sent on connection
* `errorHandler` function(error) to handle hub connection errors
* `logging` enable/disable logging
* `useSharedConnection` use a shared global connection or create a new one just for this hub, defaults to `true`
* `transport` sets transport method (e.g ```'longPolling'``` or ```['webSockets', 'longPolling']```)
* `hubDisconnected` function() to handle hub connection disconnected event

##Demo

[A simple demo using OData, Signalr, and Angular](https://github.com/JustMaier/signalrgrid)

It's an adaption of [turanuk's great SignalR demo with Knockout](https://github.com/turanuk/signalrgrid).

##Notes

* I would recommend creating a factory or service around the Hub so that you have an easy to use "model handler" that can include SignalR and Web API calls and be easily pulled into any controller
* For an example of Web API, SignalR, and Angular working together check out this [small demo](https://github.com/JustMaier/signalrgrid) I adapted from [turanuk's SignalR demo with Knockout](https://github.com/turanuk/signalrgrid)
