var prismApp=angular.module("PrismApp", ['ngSanitize','ngRoute']).run(['$location', '$rootElement','$rootScope', function ($location, $rootElement,$rootScope) {
    //$rootElement.off('click');
}]);

angular.module("PrismApp").controller("PrismController", ["$scope","download","$rootScope","$location","$routeParams",require("./prismController")]);
angular.module("PrismApp").directive("prismTabs", ["$http","$timeout","$sce",require("./directives/prismTabs")]);
angular.module("PrismApp").directive("tabHeader",require("./directives/tabHeader"));
angular.module("PrismApp").directive("tabContent",require("./directives/tabContent"));
angular.module('ng').service("download", ["$http","$window",require("./services/download")]);
module.exports=prismApp;