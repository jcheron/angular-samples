var forwardLink=function($compile,$rootScope,$window,$timeout,$filter) {
	return {
		restrict: "A",
		scope: {},
		link: function(scope, elem, attrs) {
			scope.start=false;
			scope.pbValue=0;
			if(angular.isUndefined($rootScope.dialogs)){
				$rootScope.dialogs=new Array();
			}
			var id="dialog"+$rootScope.dialogs.length;
			$rootScope.dialogs.push(id);
				var newDirective = angular.element('<modal did="'+id+'" title="'+elem.attr('title')+'" url="'+$filter('truncate')(elem.attr('href'),15)+'">'+elem.html()+
				'<progress-bar max="100" min="0" ng-model="pbValue" autorun="true" start="{{start}}" onterminated="end()"></progress-bar>'+
				'</modal>');
				$compile(newDirective)(scope);
				$(document.body).append(newDirective);
			
			scope.end=function(){
				$timeout(function(){
					$("#"+id).modal('hide');
					var w=$window.open(elem.attr('href'),elem.attr('target'));
					w.blur();
					$timeout(function(){w.focus();},0);
					console.log(elem.attr('href'));
				},400);
			};

			elem.bind('click', function() {
				$("#"+id).on('show.bs.modal',function(){
					scope.$apply(function(){scope.start=true;});
					//$rootScope.$broadcast('start', true);
				});
				$("#"+id).on('hide.bs.modal',function(){
					scope.start=false;
				});
				$('#btAccess-'+id).click(function(){
					$("#"+id).modal('hide');
					scope.openTarget();
				});
				$("#"+id).modal({"backdrop": false,"show":true});
				return false;
			});
		}
	};
};
module.exports=forwardLink;