var app=angular.module("AlertApp", ['ngSanitize']);
angular.module("AlertApp").controller("AlertController", ["$scope","alertConstants","$sce",function($scope,alertConstants,$sce) {
	$scope.styles=alertConstants.styles;
	$scope.style=$scope.styles[0];

	$scope.content=$scope.style.v;
	$scope.closeButton=true;
	$scope.alerts=new Array();
	$scope.count=1;
	 $scope.trustedContent = function(content) {
         return $sce.trustAsHtml(content);
       };
	$scope.create=function(){
		for(var i=0;i<$scope.count;i++){
			var alert={};
			alert.style=$scope.style.k;
			alert.content=$scope.trustedContent($scope.content);
			alert.closeButton=$scope.closeButton;
			$scope.alerts.push(alert);
		}
	};
	$scope.close=function(){
		if($scope.content.indexOf("Impossible de fermer l'alerte témoin")===-1){
			$scope.content=$scope.content+"<br>Impossible de fermer l'alerte témoin !";
		}
		return false;
	};

	$scope.changeStyle=function(){
		$scope.content=$scope.style.v;
	};
	$scope.closeAlert=function(alert){
		var index = $scope.alerts.indexOf(alert);
		$scope.alerts.splice(index, 1);
	};
}]);

angular.module("AlertApp").constant('alertConstants', {
	styles: [{k:'success',v:'<strong>Well done!</strong> You successfully read this important alert message.'},
	         {k:'info',v:'<strong>Heads up!</strong> This alert needs your attention, but it\'s not super important.'},
	         {k:'warning',v:'<strong>Warning!</strong> Better check yourself, you\'re not looking too good.'},
	         {k:'danger',v:'<strong>Oh snap!</strong> Change a few things up and try submitting again.'}],
});
angular.module("AlertApp").directive("bsAlert", [require("./alertDirective.js")]);
module.exports=app.name;