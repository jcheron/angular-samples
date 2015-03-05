module.exports=function() {
	
	return {
		restrict: "E",
		scope : {style: "@", closeButton: "@", onClose:"&"},
		templateUrl: 'js/ex8-alert-dir/app/templates/alert.html',
		transclude: true,
		replace:false,
		link: function(scope, elm, attrs,ctrl,transclude) {
			attrs.$observe('closeButton', function() {
				scope.closeButton = scope.$eval(attrs.closeButton);
			});
			elm.on("close.bs.alert",function(){
				var result;
				scope.$apply(function(){
					if(angular.isDefined(scope.onClose)){
						result= scope.onClose();
					}
				});
				return result;
			});
		}
	};
};