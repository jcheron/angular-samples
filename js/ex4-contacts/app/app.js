var contactsApp=angular.module("ContactApp", []);
angular.module("ContactApp").controller("ContactController", ["$scope",require("./contactsControllers")]);
angular.module("ContactApp").directive("contactElem",require("./contactsElem"));
angular.module("ContactApp").directive("frmContactElem",require("./frmContact"));
angular.module("ContactApp").filter("NotDeletedFilter", require("./contactsFilters"));
module.exports=contactsApp;