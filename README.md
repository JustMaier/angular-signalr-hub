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

####Javascript
```javascript
angular.module('app',['SignalR'])
.factory('Employees',['$rootScope','Hub', function($rootScope, Hub){
	var Employees = this;

	var hub = new Hub('employee', {
		//Client methods
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
		//Server method stubs for ease of access
		['lock', 'unlock']
	);

	Employees.edit = function (employee) {
		hub.lock(employee.Id); //Calling a server method
	};
	Employees.done = function (employee) {
		hub.unlock(employee.Id); //Calling a server method
	}

	//Helper functions and additional variables removed to keep this short...
}]);
```

##Demo

[A simple demo using OData, Signalr, and Angular](https://github.com/JustMaier/signalrgrid)

It's an adaption of [turanuk's great SignalR demo with Knockout](https://github.com/turanuk/signalrgrid).

##Notes

* I would recommend creating a factory or service around the Hub so that you have an easy to use "model handler" that can include SignalR and Web API calls and be easily pulled into any controller
* For an example of Web API, SignalR, and Angular working together check out this [small demo](https://github.com/JustMaier/signalrgrid) I adapted from [turanuk's SignalR demo with Knockout](https://github.com/turanuk/signalrgrid)