var app=angular.module("calcApp", ['ngCookies']);
app.service("calcService",["$cookies",require("./calcService")]);
app.controller("calcController", ["$scope","calcService",require("./calcController")]);
app.directive('btn', ["$compile",require("./buttonDirective")]);
app.directive('focusMe', [require("./../directives/focusMe")]);

module.exports=app;