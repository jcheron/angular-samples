var mainController=function($scope,$location,$window,run){
	$scope.vousEtesIci=function(){
		return $location.path().replace("/","");
	}

	$scope.returnHome=$location.path()!=="/home";
	$scope.pb=1;
	$scope.returnToCode=function(){
		var url=$location.path();
		return "run/"+url.substring(url.lastIndexOf('/')+1);;
	}
	$scope.isRunning=function(){
		return $location.path().indexOf("run")==-1 && $location.path().indexOf("ex")>-1;
	}
};
module.exports=mainController;