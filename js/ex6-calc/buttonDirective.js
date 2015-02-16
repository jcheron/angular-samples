var button=function($compile){
	return {
		restrict: 'E',
		transclude: false,
		replace:true,
		scope: { value:'@',add:'&ngClick',cssClass:'@',title:'@'},
		link: function(scope, element, attrs) {
			switch (scope.value) {
			case ' ':
				element.replaceWith($compile('<span class="space">&nbsp;</span>')(scope));
				break;
			case '\n':
				element.replaceWith($compile('<br class="clear">')(scope));
				break;
			default:
				var cssClass=scope.cssClass;
				if(cssClass==""){
					if(scope.value==parseInt(scope.value+""))
						cssClass+="btn-default";
					else
						cssClass+="btn-info";
				}
				element.replaceWith($compile('<input title="{{title}}" type="button" value="{{value}}" class="btn calcBtn '+cssClass+'" data-ng-click="add(\'{{value}}\')">')(scope));
				break;
			}
		}
	};
};
module.exports=button;