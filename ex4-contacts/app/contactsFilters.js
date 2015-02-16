angular.module("ContactApp").filter("NotDeletedFilter", function() {
	return function( items) {
        var filtered = [];
        angular.forEach(items, function(item) {
            if(!item.deleted) {
                filtered.push(item);
            }
        });
        return filtered;
    };
});