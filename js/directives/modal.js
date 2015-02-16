var modal= function() {
	return {
		restrict:'E',
		scope : {title: "@",body: "@",url: "@",did: "@"},
		templateUrl: 'js/templates/modal.html',
		transclude: true,
		replace:true
	};
};
module.exports=modal;