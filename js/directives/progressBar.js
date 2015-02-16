var progressBar=function($interval,$parse,$timeout,$rootScope) {
	return {
		restrict:'E',
		require: 'ngModel',
		scope : {min: "@",value: "=ngModel",max: "@",onprogress: "&",onterminated: "&",autorun: "@",start: "@"},
		templateUrl: 'js/templates/progressbar.html',
		transclude: false,
		replace:true,
		link: function(scope, elm, attrs,ngModelController) {
			scope.incTimer=null;
			var myS=scope;
			scope.inc=function(){
				if(!scope.isTerminated(myS.value)){
					myS.value++;
				}
			};
			scope.isTerminated=function(value){
				var result=false;
				if(value==scope.max){
					$interval.cancel(scope.incTimer);
					if(scope.onterminated)
						 scope.onterminated();
					result=true;
					//$rootScope.$broadcast('terminated.pb', true);
				}
				return result;
			}
			scope.startTimer=function(){
				if(scope.autorun && !scope.incTimer)
					scope.incTimer=$interval(scope.inc,100);
			};
			scope.stopTimer=function(){
				if(scope.incTimer){
					$interval.cancel(scope.incTimer);
					scope.incTimer=null;
				}
			};
			
			elm.on('$destroy', function() {
				scope.stopTimer();
			});
			attrs.$observe('value', function(value) {
				scope.isTerminated(value);
				scope.value = scope.$eval(attrs.value);
			});
			
			attrs.$observe('start', function(value) {
				if(scope.$eval(value)){
					scope.startTimer();
				}else{
					scope.stopTimer();
					scope.value=0;
				}
			});
			scope.$on('start', function(event, mass) {
				scope.value=0;
				scope.startTimer();
			});
			
			scope.$on('reset', function(event, mass) {
				scope.stopTimer();
				scope.$apply(function () {
					scope.start=false;
					scope.value=0;
				});
			});
			
			attrs.$observe('autorun', function(v) {
				if(eval(v)==false){
					scope.stopTimer();
				}else if(scope.start==true){
					scope.startTimer();
				}
			});
		}
	};
};
module.exports=progressBar;