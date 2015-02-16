var currApp=angular.module("currencyApp", []);
angular.module("currencyApp").controller("currencyController",['$scope','$http','$interval','$cookies',require("./currencyControllers")]);
angular.module("currencyApp").directive("histoElem",require("./histoElemDirective"));
angular.module('currencyApp').directive("classchange",require("./classChangeDirective"));
module.exports=currApp;