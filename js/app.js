require("./ex2-services/app");
require("./ex3-choixMultiples/app");
require("./ex4-contacts/app/app");
require("./ex5-currency/app/app");
require("./ex6-calc/app");
require("./prismApp/app");

require("./prismApp/app");
angular.module("mainApp", ["ngAnimate","ngRoute",require("./ex1-note/app"),"ServicesApp","ListesApp","ContactApp","currencyApp","calcApp","PrismApp"])
.factory("run", function() {
	var value;
    var valueService = {};
    valueService.getValue = function() {
        return value;
    };
    valueService.setValue = function(newValue) {
        value=newValue;
    };
    return valueService;
});;
angular.module("mainApp").config(['$routeProvider','$locationProvider',require("./routes")]);
angular.module("mainApp").directive("forwardLink", ["$compile","$rootScope","$window","$timeout","$filter",require('./directives/forwardLink')]);
angular.module("mainApp").directive('drag', require("./directives/drag"));
angular.module("mainApp").directive("modal",require("./directives/modal"));
angular.module("mainApp").directive("progressBar", ["$interval","$parse","$timeout","$rootScope",require("./directives/progressBar")]);

angular.module("mainApp").filter('truncate',require("./filters/truncate"));

angular.module("mainApp").controller("RouteController",["$scope","$location","$window","run",require("./controllers/mainController")]);