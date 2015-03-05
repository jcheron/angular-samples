module.exports=function() {
	
	return {
		restrict: "E",
		scope : {style: "@",glyphicon: "@",disabled: "@", active: "@"},
		templateUrl: function(el,attrs){
            return (angular.isDefined(attrs.glyphicon)) ? 'js/ex7-button-dir/app/templates/buttonGlyph.html' : 'js/ex7-button-dir/app/templates/button.html';
        },
		transclude: true,
		replace:false,
		link: function(scope, elm, attrs) {
			attrs.$observe('disabled', function() {
				scope.disabled = scope.$eval(attrs.disabled);
			});
			attrs.$observe('active', function() {
				scope.active = scope.$eval(attrs.active);
			});
		}
	};
};