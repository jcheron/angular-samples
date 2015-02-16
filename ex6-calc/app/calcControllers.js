angular.module("calcApp").controller("calcController", ["$scope","CalcService",function($scope,CalcService) {
	$scope.gui=CalcService.gui;
	$scope.ops=CalcService.ops;
//	$("#calc").draggable({
//	    handle: "#title-calc"
//	});
	$scope.setOn=function(){
		CalcService.setOn();
		angular.element(document.querySelector("#calc")).triggerHandler('focus');
	};
	$scope.keypress=function(e){
		var key=e.which;
		var c=String.fromCharCode((96 <= key && key <= 105)? key-48 : key);
		if(c.match(/(\d|\/|\=|\+|\-|\*|\.|\(|\)|\%)+$/g)){
			CalcService.add(c);
			e.preventDefault();
			e.stopPropagation();
		}
	};
	$scope.keyup=function(e){
		var key=e.which;
		switch (key) {
		case 13:
			CalcService.add("=");
			break;
		case 8:
			CalcService.add("⇤");
			e.preventDefault();
			break;
		case 46:
			CalcService.add("C");
			break;
		}
	};
	
	$scope.add=function(element){
		CalcService.add(element);
	};
}]);