module.exports= function() {
	return {
		restrict: "E",
		require: 'ngModel',
		scope : {min: "@",value: "=ngModel",max: "@",onProgress: "&",onTerminated: "&",onStart: "&",style: "@",striped: "@", active: "@"},
		templateUrl: 'js/ex9-pb-dir/app/templates/progressbar.html',
		transclude: false,
		replace:true,
		link: function(scope, elm, attrs,ngModel) {
			attrs.$observe('striped', function() {
				scope.striped = scope.$eval(attrs.striped);
			});
			attrs.$observe('ngModel', function(value){ // Got ng-model bind path here
				scope.$watch(value,function(newValue){ // Watch given path for changes
					if(angular.isDefined(scope.onProgress)){
						scope.onProgress();
					}
					if(newValue==scope.max){
						if(angular.isDefined(scope.onTerminated)){
							scope.onTerminated();
						}
					}
					if(newValue==scope.min){
						if(angular.isDefined(scope.onStart)){
							scope.onStart();
						}
					} 
	              });
			});
			attrs.$observe('active', function() {
				scope.active = scope.$eval(attrs.active);
			});
		}
	};
};