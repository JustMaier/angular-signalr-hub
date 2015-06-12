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
		
        stateChanged: function(state){
            switch (state.newState) {
                case $.signalR.connectionState.connecting:
                    //your code here
                    break;
                case $.signalR.connectionState.connected:
                    //your code here
                    break;
                case $.signalR.connectionState.reconnecting:
                    //your code here
                    break;
                case $.signalR.connectionState.disconnected:
                    //your code here
                    break;
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
* **DEPRECATED** `hubDisconnected` function() to handle hub connection disconnected event
* `stateChanged` function() to handle hub connection state changed event

##Demo

[A simple demo using OData, Signalr, and Angular](https://github.com/JustMaier/signalrgrid)

It's an adaption of [turanuk's great SignalR demo with Knockout](https://github.com/turanuk/signalrgrid).

##Simple Chat Demo

This sample starts off with the [MVC-SignalR chat](http://www.asp.net/signalr/overview/getting-started/tutorial-getting-started-with-signalr-and-mvc) sample by Tim Teebken and Patrick Fletcher.

This sample is then reworked (in a quick and dirty way) to show how to go about using the chathub from angular by using the angular-signalr-hub.

Some extra NuGet packages are added to the project. (check out the packages.config file)
An app folder was added for the angular app, in which the following was added:
* a module (signalRChatApp)
* a factory (ChatService) 
* a controller (ChatController)
* an html page 

Modifications were made to the following files:
* BundleConfig.cs
* RouteConfig.cs
* HomeController.cs
* Global.asax.cs
* Startup.cs
* Index.cshtml

In the app folder for the angular app, there is a ChatService which uses the angular-signalr-hub.
The hub in this case is the ChatHub in this project.

Download the full sample [here](http://1drv.ms/1K3EXpQ).

The sample is provided as is. 
There are soms issues with the way it is set up, but it does the trick in showing in showing how to use the angular-signalr-hub in an easy to reproduce app.

##Multiple hubs

There is something you have to take care about when using multiple hubs in an angular app : 

Angular services are singletons, so they won't be instantiated before you need it. 

If you use shared connection between your hubs (`useSharedConnection`), and if you have two services containing hubs, you can have a problem :

The first service loaded will start the connection. Then its hub won't be registered to the server SignalR (`OnConnected` method) if the other service is instantiated after that the connection is `connected`. 
(SignalR trace : SignalR: Client subscribed to hub 'hubname'.)

To avoid that, you can put `useSharedConnection` to `false`.

##Notes

* I would recommend creating a factory or service around the Hub so that you have an easy to use "model handler" that can include SignalR and Web API calls and be easily pulled into any controller
* For an example of Web API, SignalR, and Angular working together check out this [small demo](https://github.com/JustMaier/signalrgrid) I adapted from [turanuk's SignalR demo with Knockout](https://github.com/turanuk/signalrgrid)
