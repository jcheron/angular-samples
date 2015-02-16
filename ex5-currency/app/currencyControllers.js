angular.module("currencyApp").controller("currencyController",['$scope','$http','$interval','$cookies', function($scope,$http,$interval,$cookies) {
	var alert=$(".alert");
    alert.show();

    alert.on("close.bs.alert", function(){
        alert.hide();
        return false;
    });
    
	$scope.nbRequestMax=5;
	$scope.nbRequest=0;
	if($cookies.nbRequest)
		$scope.nbRequest=$cookies.nbRequest;
	$scope.historique={};
	$scope.histo=true;
	$scope.autoRefresh=false;
	$scope.interval=3000;
	$scope.task={};
	function getFirstKey( data ) {
		for (elem in data ) 
			return elem;
	}
	$http.get('ex5-currency/app/data/currencymap.json').
	success(function(data, status, headers, config) {
		$scope.currencies = data;
		$scope.from=data["EUR"];
		$scope.to=data["USD"];
		$scope.what=1;
		$scope.result="";
	}).
	error(function(data, status, headers, config) {
		$scope.message="Erreur d'accès au fichier, statut de la réponse : "+status;
	});
	$scope.getResult=function(){
		$scope.update($scope.from,$scope.to,$scope.what);
	};
	
	$scope.update=function(from,to,what){
		if($scope.nbRequest<$scope.nbRequestMax){
			$http.jsonp('http://rate-exchange.appspot.com/currency?from='+from.code+'&to='+to.code+'&q='+what+'&callback=JSON_CALLBACK').
			success(function(data, status, headers, config) {
				$scope.result=data.v;
				$cookies.nbRequest=++$scope.nbRequest;
				$scope.message="";
				if($scope.histo===true){
					var conversion={
							from : from,
							to : to,
							amount : function(){ return this.what*this.rate},
							initialAmount : function(){ return this.what*this.initialRate},
							delta : 0,
							rate : data.rate, 
							what : what,
							date : new Date(),
							update: false,
							initialRate : data.rate
					};
					var key=from.code+to.code;
					if($scope.historique[key]){
						var oldConversion=$scope.historique[key];
						oldConversion.what=what;
						conversion.delta=conversion.amount()-oldConversion.initialAmount();
						conversion.initialRate=oldConversion.initialRate;
					}
					conversion.update=false;
					$scope.historique[key]=conversion;
				}
			}).
			error(function(data, status, headers, config) {
				$scope.message="Erreur de connexion au serveur, statut de la réponse : "+status;
			});
		}else{
			alert.show();
			var key=from.code+to.code;
			if($scope.historique[key]){
				$scope.historique[key].update=false;
			}
		}
	};
	
	$scope.histoNotEmpty=function(){
		return Object.keys($scope.historique).length>0;
	};
	
	$scope.swap=function(){
		var tmp=$scope.from;
		$scope.from=$scope.to;
		$scope.to=tmp;
		$scope.result="";
	};
	$scope.updateHisto=function(conversion){
		$scope.from=conversion.from;
		$scope.to=conversion.to;
		$scope.what=conversion.what;
		conversion.update=true;
		$scope.getResult();
	};
	$scope.deleteHisto=function(conversion){
		
	};
	$scope.refresh=function(){
		if($scope.histo===true){
			for(k in $scope.historique){
				$scope.historique[k].update=true;
				$scope.update($scope.historique[k].from,$scope.historique[k].to,$scope.historique[k].what);
			}
		}else{
			$scope.autoRefresh=false;
			$scope.startRefresh(false);
		}
	};
	$scope.startRefresh=function(start){
		if(start===true){
			$scope.task=$interval( function(){ $scope.refresh(); }, $scope.interval);
		}else{
			$interval.cancel($scope.task);
		}
	};
	$scope.updateFrequency=function(){
		if($scope.autoRefresh===true){
			$scope.startRefresh(false);
			$scope.startRefresh(true);
		}
	};
}]);