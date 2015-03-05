var routes=function($routeProvider,$locationProvider) {
	       $routeProvider.
	           when('/ex1', {
	   templateUrl: 'js/ex1-note/index.html',
	   controller: 'NoteController'
	   }).when('/ex2', {
	   templateUrl: 'js/ex2-services/index.html',
	   controller: 'ServicesController'
	   }).when('/ex3', {
	   templateUrl: 'js/ex3-choixMultiples/index.html',
	   controller: 'ListesController'
	   }).when('/ex4', {
	   templateUrl: 'js/ex4-contacts/contact.html',
	   controller: 'ContactController'
	   }).when('/ex5', {
	   templateUrl: 'js/ex5-currency/index.html',
	   controller: 'currencyController'
	   }).when('/ex6', {
	   templateUrl: 'js/ex6-calc/index.html',
	   controller: 'calcController'
	   }).when('/ex7', {
	   templateUrl: 'js/ex7-button-dir/index.html',
	   controller: 'ButtonController'
	   }).when('/ex8', {
		templateUrl: 'js/ex8-alert-dir/index.html',
		controller: 'AlertController'
		}).when('/ex9', {
		templateUrl: 'js/ex9-pb-dir/index.html',
		controller: 'PbController'
		}).when('/home', {
		templateUrl: 'templates/home.html',
		controller: 'RouteController'
		}).when('/run/:ex', {
	   templateUrl: 'templates/prism.html',
	   controller: 'PrismController'
	   }).otherwise({
		redirectTo: '/home'
	       	});
	       if(window.history && window.history.pushState){
	    	    $locationProvider.html5Mode(true);
	    	  }
	   };
	   module.exports=routes;