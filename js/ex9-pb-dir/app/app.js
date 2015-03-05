var app=angular.module("pbApp", []);
angular.module("pbApp").controller("PbController", ["$scope","pbConstants","$interval","$timeout",function($scope,pbConstants,$interval,$timeout) {
	$scope.value=0;
	$scope.max=100;
	$scope.min=0;
	$scope.styles=pbConstants.styles;
	$scope.style=$scope.styles[0];
	$scope.striped=false;
	$scope.active=false;
	$scope.incTimer=null;
	$scope.interval=100;
	$scope.repeat=false;
	$scope.showMessage=false;
	
	$scope.inc=function(){
		if($scope.value<$scope.max){
			$scope.value++;
		}else{
			if($scope.repeat===false){
				$scope.stop();
			}else{
				$scope.stop();
				$scope.value=0;
				$timeout(function() {$scope.start();},500);
			}
		}
	};
	
	$scope.start=function(){
		$scope.incTimer=$interval($scope.inc,$scope.interval,0,true);
	};
	$scope.stop=function(){
		$interval.cancel($scope.incTimer);
		$scope.incTimer=null;
	};
	$scope.restart=function(){
		if($scope.incTimer!==null){
			$scope.stop();
			$scope.start();
		}
	};
	
	$scope.onStart=function(){
		$scope.showMessage=false;
		$scope.message="Start";
	};
	
	$scope.onProgress=function(){
		$scope.showMessage=true;
		$scope.message="En cours...";
		$scope.progression=$scope.value/$scope.max*100;
	};
	
	$scope.onTerminated=function(){
		$scope.showMessage=true;
		$scope.message="Terminé !";
	};
	
	$scope.$on('$destroy', function() {
		$scope.stop();
	});
}]);

angular.module("pbApp").constant('pbConstants', {
	styles: ['success','info','warning','danger'],
});
angular.module("pbApp").directive("bsProgressBar",require("./pbDirective"));
module.exports=app.name;