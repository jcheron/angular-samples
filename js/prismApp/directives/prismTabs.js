var tabs=function($http,$timeout,$sce) {
	return {
		restrict:"E",
		scope:{tabs:"=ngModel"},
		replace: true,
		templateUrl:"js/templates/tabs.html",
		link: function(scope, elem, attrs) {
			var languages={"js":"javascript","html":"markup","css":"css"};
			var loadTab=function(index){
				if(index<scope.tabs.length){
					var tab=scope.tabs[index];
					$http.get(tab.file).success(function(data, status, headers, config) {
						var ext=tab.file.split('.').pop();
						var htmlEntities=function(str) {
							return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
						}
						if(angular.isDefined(languages[ext])){
							var comment=scope.tabs[index].comment;
							if(angular.isUndefined(comment)|| comment==="")
								comment="";
							else{
								comment=""+comment+"";
							}
							tab.content=comment+"<pre class='code-toolbar line-numbers'><code class='language-"+languages[ext]+"'>"+htmlEntities(data)+"</code></pre>";
						}else{
							tab.content=data;
						}
						loadTab(++index);
					}).error(function(data, status, headers, config) {
						console.log("Erreur de chargement de "+tab.file+" statut : "+status);
					});
				}else{
					scope.tabs[0].active=true;
					Prism.highlightAll();
				}
			};
			loadTab(0);
			scope.loaded=true;
			$("#"+elem.attr("id")).tab();
			$("#"+elem.attr("id")).on('shown.bs.tab', function (e) {
				var href=$(e.target).attr("href");
				Prism.highlightElement($(href+" pre code")[0]);
				});
		}
	}
};
module.exports=tabs;