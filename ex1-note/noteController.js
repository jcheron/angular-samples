angular.module("NoteApp").controller("NoteController", function($scope) {
    $scope.message = "";
    $scope.info="";
    $scope.status=1;
    $scope.count  = function() {return 100 - $scope.message.length;};
    $scope.clear = function() {$scope.message = "";$scope.info="";};
    $scope.save  = function() {$scope.info="Note sauvegardée";};
    $scope.updateInfo=function() {
    	if($scope.message)
    		$scope.info="Note modifiée";
    };
});