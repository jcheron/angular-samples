/**
 * 
 */
angular.module("ContactApp").directive("contactElem",function(){
	return {
		restrict:"A",
		templateUrl:"ex4-contacts/templates/v_contact.html"
	}
});
angular.module("ContactApp").directive("frmContactElem",function(){
	return {
		restrict:"E",
		templateUrl:"ex4-contacts/templates/v_frmContact.html"
	}
});