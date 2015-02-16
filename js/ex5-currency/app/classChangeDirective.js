var classChange=function(){
    return {
        restrict:'A',
	    link: function(scope, element) {
	    	scope.$watch(function() {return element.attr('class'); }, function(newValue){
	    		element.show();
	    	});
		}
    };
};

module.exports=classChange;