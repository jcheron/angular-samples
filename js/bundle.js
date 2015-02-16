(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require("./ex2-services/app");
require("./ex3-choixMultiples/app");
require("./ex4-contacts/app/app");
require("./ex5-currency/app/app");
require("./ex6-calc/app");
require("./prismApp/app");

require("./prismApp/app");
angular.module("mainApp", ["ngAnimate","ngRoute",require("./ex1-note/app"),"ServicesApp","ListesApp","ContactApp","currencyApp","calcApp","PrismApp"])
.factory("run", function() {
	var value;
    var valueService = {};
    valueService.getValue = function() {
        return value;
    };
    valueService.setValue = function(newValue) {
        value=newValue;
    };
    return valueService;
});;
angular.module("mainApp").config(['$routeProvider','$locationProvider',require("./routes")]);
angular.module("mainApp").directive("forwardLink", ["$compile","$rootScope","$window","$timeout","$filter",require('./directives/forwardLink')]);
angular.module("mainApp").directive('drag', require("./directives/drag"));
angular.module("mainApp").directive("modal",require("./directives/modal"));
angular.module("mainApp").directive("progressBar", ["$interval","$parse","$timeout","$rootScope",require("./directives/progressBar")]);

angular.module("mainApp").filter('truncate',require("./filters/truncate"));

angular.module("mainApp").controller("RouteController",["$scope","$location","$window","run",require("./controllers/mainController")]);
},{"./controllers/mainController":2,"./directives/drag":3,"./directives/forwardLink":5,"./directives/modal":6,"./directives/progressBar":7,"./ex1-note/app":8,"./ex2-services/app":10,"./ex3-choixMultiples/app":11,"./ex4-contacts/app/app":12,"./ex5-currency/app/app":17,"./ex6-calc/app":21,"./filters/truncate":25,"./prismApp/app":26,"./routes":32}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
var drag=function() {
	  return {
	    restrict: 'A',
	    link: function(scope, elm, attrs) {
	      var options = scope.$eval(attrs.drag);
	      elm.draggable(options);//! Nécessite JQuery UI
	    }
	  };
	};
	module.exports=drag;
},{}],4:[function(require,module,exports){
var focusMe=function() {
return {
	    scope: { trigger: '=focusMe' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
        if(value === true) {
            element[0].focus();
            scope.trigger = false;
        }
      });
    }
  };
};
module.exports=focusMe;
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
var modal= function() {
	return {
		restrict:'E',
		scope : {title: "@",body: "@",url: "@",did: "@"},
		templateUrl: 'js/templates/modal.html',
		transclude: true,
		replace:true
	};
};
module.exports=modal;
},{}],7:[function(require,module,exports){
var progressBar=function($interval,$parse,$timeout,$rootScope) {
	return {
		restrict:'E',
		require: 'ngModel',
		scope : {min: "@",value: "=ngModel",max: "@",onprogress: "&",onterminated: "&",autorun: "@",start: "@"},
		templateUrl: 'js/templates/progressbar.html',
		transclude: false,
		replace:true,
		link: function(scope, elm, attrs,ngModelController) {
			scope.incTimer=null;
			var myS=scope;
			scope.inc=function(){
				if(!scope.isTerminated(myS.value)){
					myS.value++;
				}
			};
			scope.isTerminated=function(value){
				var result=false;
				if(value==scope.max){
					$interval.cancel(scope.incTimer);
					if(scope.onterminated)
						 scope.onterminated();
					result=true;
					//$rootScope.$broadcast('terminated.pb', true);
				}
				return result;
			}
			scope.startTimer=function(){
				if(scope.autorun && !scope.incTimer)
					scope.incTimer=$interval(scope.inc,100);
			};
			scope.stopTimer=function(){
				if(scope.incTimer){
					$interval.cancel(scope.incTimer);
					scope.incTimer=null;
				}
			};
			
			elm.on('$destroy', function() {
				scope.stopTimer();
			});
			attrs.$observe('value', function(value) {
				scope.isTerminated(value);
				scope.value = scope.$eval(attrs.value);
			});
			
			attrs.$observe('start', function(value) {
				if(scope.$eval(value)){
					scope.startTimer();
				}else{
					scope.stopTimer();
					scope.value=0;
				}
			});
			scope.$on('start', function(event, mass) {
				scope.value=0;
				scope.startTimer();
			});
			
			scope.$on('reset', function(event, mass) {
				scope.stopTimer();
				scope.$apply(function () {
					scope.start=false;
					scope.value=0;
				});
			});
			
			attrs.$observe('autorun', function(v) {
				if(eval(v)==false){
					scope.stopTimer();
				}else if(scope.start==true){
					scope.startTimer();
				}
			});
		}
	};
};
module.exports=progressBar;
},{}],8:[function(require,module,exports){
var noteApp=angular.module("NoteApp", []);
angular.module("NoteApp").controller("NoteController", require("./controller"));
module.exports=noteApp.name;
},{"./controller":9}],9:[function(require,module,exports){
var noteController=function($scope) {
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
};
module.exports=noteController;
},{}],10:[function(require,module,exports){
var servicesApp=angular.module('ServicesApp', []);
angular.module("ServicesApp").controller("ServicesController", [ "$scope", function($scope) {
	$scope.services = [
	           		{
	           			name: 'Web Development',
	           			price: 300,
	           			active:true
	           		},{
	           			name: 'Design',
	           			price: 400,
	           			active:false
	           		},{
	           			name: 'Integration',
	           			price: 250,
	           			active:false
	           		},{
	           			name: 'Formation',
	           			price: 220,
	           			active:false
	           		}
	           	];

	           	$scope.toggleActive = function(s){
	           		s.active = !s.active;
	           	};
	           	$scope.total = function(){

	           		var total = 0;
	           		$scope.count=0;

	           		angular.forEach($scope.services, function(s){
	           			if (s.active){
	           				total+= s.price;
	           				$scope.count++;
	           			}
	           		});

	           		return total;
	           	};
} ]);

module.exports=servicesApp;


},{}],11:[function(require,module,exports){
var choixApp=angular.module('ListesApp', []);
angular.module("ListesApp").controller("ListesController", [ "$scope", function($scope) {
	$scope.dispoItems = [
				{
					url: 'http://tutorialzine.com/2013/07/50-must-have-plugins-for-extending-twitter-bootstrap/',
					title: '50 Must-have plugins for extending Twitter Bootstrap',
					image: 'http://cdn.tutorialzine.com/wp-content/uploads/2013/07/featured_4-100x100.jpg'
				},
				{
					url: 'http://tutorialzine.com/2013/08/simple-registration-system-php-mysql/',
					title: 'Making a Super Simple Registration System With PHP and MySQL',
					image: 'http://cdn.tutorialzine.com/wp-content/uploads/2013/08/simple_registration_system-100x100.jpg'
				},
				{
					url: 'http://tutorialzine.com/2013/08/slideout-footer-css/',
					title: 'Create a slide-out footer with this neat z-index trick',
					image: 'http://cdn.tutorialzine.com/wp-content/uploads/2013/08/slide-out-footer-100x100.jpg'
				},
				{
					url: 'http://tutorialzine.com/2013/06/digital-clock/',
					title: 'How to Make a Digital Clock with jQuery and CSS3',
					image: 'http://cdn.tutorialzine.com/wp-content/uploads/2013/06/digital_clock-100x100.jpg'
				},
				{
					url: 'http://tutorialzine.com/2013/05/diagonal-fade-gallery/',
					title: 'Smooth Diagonal Fade Gallery with CSS3 Transitions',
					image: 'http://cdn.tutorialzine.com/wp-content/uploads/2013/05/featured-100x100.jpg'
				},
				{
					url: 'http://tutorialzine.com/2013/05/mini-ajax-file-upload-form/',
					title: 'Mini AJAX File Upload Form',
					image: 'http://cdn.tutorialzine.com/wp-content/uploads/2013/05/ajax-file-upload-form-100x100.jpg'
				},
				{
					url: 'http://tutorialzine.com/2013/04/services-chooser-backbone-js/',
					title: 'Your First Backbone.js App – Service Chooser',
					image: 'http://cdn.tutorialzine.com/wp-content/uploads/2013/04/service_chooser_form-100x100.jpg'
				}
			];
	$scope.step=1;
	$scope.includedItems=[];
	$scope.selectedIncludedItems=[];$scope.selectedDispoItems=[];
	$scope.addToIncluded=function(){
		$scope.selectedIncludedItems=[];
		 angular.forEach($scope.selectedDispoItems, function (value) {
			$scope.includedItems.push(value);
			$scope.selectedIncludedItems.push(value);
			$scope.dispoItems.splice($scope.dispoItems.indexOf(value),1);
	 });
		 $scope.selectedDispoItems=[];
	};
	$scope.addAllToIncluded=function(){
		$scope.includedItems.push.apply($scope.includedItems, $scope.dispoItems);
		$scope.dispoItems=[];
		$scope.selectedDispoItems=[];
	};
	$scope.removeFromIncluded=function(){
		$scope.selectedDispoItems=[]; 
		angular.forEach($scope.selectedIncludedItems, function (value) {
			$scope.dispoItems.push(value);
			$scope.selectedDispoItems.push(value);
			$scope.includedItems.splice($scope.includedItems.indexOf(value),1);
	});
		$scope.selectedIncludedItems=[];
	};
	$scope.removeAllFromIncluded=function(){
		$scope.dispoItems.push.apply($scope.dispoItems, $scope.includedItems);
		$scope.includedItems=[];
		$scope.selectedIncludedItems=[];
	};
	$scope.selectItem=function(){
		$scope.addToIncluded();
	};
	$scope.deselectItem=function(){
		$scope.removeFromIncluded();
	};
} ]);

module.exports=choixApp;


},{}],12:[function(require,module,exports){
var contactsApp=angular.module("ContactApp", []);
angular.module("ContactApp").controller("ContactController", ["$scope",require("./contactsControllers")]);
angular.module("ContactApp").directive("contactElem",require("./contactsElem"));
angular.module("ContactApp").directive("frmContactElem",require("./frmContact"));
angular.module("ContactApp").filter("NotDeletedFilter", require("./contactsFilters"));
module.exports=contactsApp;
},{"./contactsControllers":13,"./contactsElem":14,"./contactsFilters":15,"./frmContact":16}],13:[function(require,module,exports){
var contactController=function($scope) {
	$scope.title="Contacts";
	$scope.edit=false;
	$scope.operation="Ajouter un contact";
	$scope.contacts=[{nom:"ZUCKERBERG",prenom:"Mark",email:"mark@facebook.com"},
	                 {nom:"GATES",prenom:"Bill",email:"bill@microsoft.com"},
	                 {nom:"JOBS",prenom:"Steeve",email:"Steeve@apple.com"}];
	this.contact=null;
	
	$scope.update=function(){
		if($scope.contact==null)
			this.contacts.push($scope.tmpContact);
		else{
			angular.copy($scope.tmpContact, this.contact);
		}
		$scope.contact=null;
		$scope.edit=false;
	};
	
	$scope.toUpdate=function(contact){
		$scope.operation="Modifier un contact";
		$scope.contact=contact;
		$scope.tmpContact=angular.copy(contact);
		$scope.edit=true;
	};
	
	$scope.toAdd=function(){
		$scope.operation="Ajouter un contact";
		$scope.contact=null;
		$scope.tmpContact={};
		$scope.edit=true;
	};
	
	$scope.delete=function(contact){
		var index = this.contacts.indexOf(contact);
		this.contact.deleted=true;
		//this.contacts.splice(index, 1);
		$scope.edit=false;
	};
	
	$scope.cancelOne=function(){
		angular.forEach($scope.contacts,function(contact){
			if(contact.deleted===true){ 
				contact.deleted=false;
			}
		});
	}
	
	this.edit=function(c){
		$scope.contact=c;
		$scope.txtNom=c.nom;$scope.txtPrenom=c.prenom;$scope.txtEmail=c.email;
		$scope.edit=true;
	}
};
module.exports=contactController;
},{}],14:[function(require,module,exports){
var contactElem=function(){
	return {
		restrict:"A",
		templateUrl:"js/ex4-contacts/templates/v_contact.html"
	}
};
module.exports=contactElem;

},{}],15:[function(require,module,exports){
var notDeleted=function() {
	return function( items) {
        var filtered = [];
        angular.forEach(items, function(item) {
            if(!item.deleted) {
                filtered.push(item);
            }
        });
        return filtered;
    };
};
module.exports=notDeleted;
},{}],16:[function(require,module,exports){
var frmContact=function(){
	return {
		restrict:"E",
		templateUrl:"js/ex4-contacts/templates/v_frmContact.html"
	}
};
module.exports=frmContact;
},{}],17:[function(require,module,exports){
var currApp=angular.module("currencyApp", []);
angular.module("currencyApp").controller("currencyController",['$scope','$http','$interval','$cookies',require("./currencyControllers")]);
angular.module("currencyApp").directive("histoElem",require("./histoElemDirective"));
angular.module('currencyApp').directive("classchange",require("./classChangeDirective"));
module.exports=currApp;
},{"./classChangeDirective":18,"./currencyControllers":19,"./histoElemDirective":20}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
var currencyController= function($scope,$http,$interval,$cookies) {
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
	$http.get('js/ex5-currency/app/data/currencymap.json').
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
};

module.exports=currencyController;
},{}],20:[function(require,module,exports){
var histoElem=function(){
	return {
		restrict:"A",
		templateUrl:"js/ex5-currency/templates/v_histo.html"
	}
};
module.exports=histoElem;
},{}],21:[function(require,module,exports){
var app=angular.module("calcApp", ['ngCookies']);
app.service("calcService",["$cookies",require("./calcService")]);
app.controller("calcController", ["$scope","calcService",require("./calcController")]);
app.directive('btn', ["$compile",require("./buttonDirective")]);
app.directive('focusMe', [require("./../directives/focusMe")]);

module.exports=app;
},{"./../directives/focusMe":4,"./buttonDirective":22,"./calcController":23,"./calcService":24}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
var calcController=function($scope,CalcService) {
	$scope.gui=CalcService.gui;
	$scope.ops=CalcService.ops;

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
};
module.exports=calcController;
},{}],24:[function(require,module,exports){
var calcService=function($cookies) {
	this.gui={screen:"0",operateur:undefined,result:undefined,on:true};
	this.ops=[
	            {value:'('},
	            {value:')'},
	            {value:'M'},
	            {value:' '},
	            {value:'RM'},
	            {value:'Off',cssClass:"btn-danger",title:"Eteindre la calculatrice"},
	            {value:'\n'},
	            {value:"⇤"},
	            {value:"CE"},
	            {value:"C"},
	            {value:" "},
	            {value:"±"},
	            {value:"√x"},
	            {value:"\n"},
	            {value:7},
	            {value:8},
	            {value:9},
	            {value:' '},
	            {value:'/'},
	            {value:'%'},
	            {value:'\n'},
	            {value:4},
	            {value:5},
	            {value:6},
	            {value:' '},
	            {value:'*'},
	            {value:'1/x'},
	            {value:'\n'},
	            {value:1},
	            {value:2},
	            {value:3},
	            {value:' '},
	            {value:'-'},
	            {value:'\n'},
	            {value:0,cssClass:"colspan btn-default"},
	            {value:'.',cssClass:"btn-default"},
	            {value:' '},
	            {value:'+'},
	            {value:'=',cssClass:"rowspan btn-success",title:"Calculer ([ENTREE]) !"}
	            ];
	var isOperateur=function(element){
		return parseInt(element)!=element && element!="." && element!="⇤" && element!="(" && element!=")";
	};
	var calc=function(obj){
		var isError=false;
		try {
			obj.gui.result=eval(obj.gui.screen.replace('√','Math.sqrt').replace(/^0+/g,''));
		} catch (e) {
			isError=true;
		}
		return isError;
	};
	this.add=function(element){
		if(this.gui.screen==0)
			this.gui.screen="";
		switch (element) {
		case 'Off':
			this.gui.on=false;
			$cookies.memory=undefined;
			this.gui.screen="";
			this.gui.result=undefined;
			break;
		case "M":
			if(this.gui.result)
				$cookies.memory=this.gui.result+"";
			break;
		case "RM":
			if($cookies.memory){
				this.gui.screen+=$cookies.memory;
				calc(this);
			}
			break;
		case '=':
			if(this.gui.result)
				this.gui.screen=this.gui.result;
			break;
		case '1/x':
			if(this.gui.result){
				this.gui.screen="1/("+this.gui.screen+")";
				this.gui.result=1/this.gui.result;
			}
			break;
		case '√x':
			if(this.gui.result){
				this.gui.screen="√("+this.gui.screen+")";
				this.gui.result=Math.sqrt(this.gui.result);
			}
			break;
		case '%':
			if(this.gui.result){
				this.gui.screen="("+this.gui.screen+")/100";
				this.gui.result=this.gui.result/100;
			}
			break;
		case "⇤":
			this.gui.screen=(this.gui.screen+"").substring(0,(this.gui.screen+"").length-1);
			calc(this);
			break;
		case "±":
			var value;
			var exp=/(\-{0,1}(\d|\.)+)$/g;
			this.gui.screen=this.gui.screen+"";
			var match=exp.exec(this.gui.screen);
			if(match){
				try{
					if(match[1].substring(0,1)=="-")
						value=eval("+"+match[1].substring(1));
					else
						value=eval("-"+match[1]);
				}catch(e){}
				if(value)
					this.gui.screen=this.gui.screen.replace(exp,value);
			}
				
			calc(this);
			break;
		case ".":
			var value;
			var exp=/(\-{0,1}(\d|\.)+)$/g;
			this.gui.screen=this.gui.screen+"";
			var match=exp.exec(this.gui.screen);
			if(match){
				try{
					if(match[1].indexOf(".")!=-1)
						return;
				}catch(e){}
			}
			this.gui.operateur=undefined;
			this.gui.screen+=element;
			calc(this);
			break;
		case "CE":
			this.gui.screen=(this.gui.screen+"").replace(/((\d|\.)+)$/g,"");
			calc(this);
			break;
		case "C":
			this.gui.screen="0";
			this.gui.result=undefined;
			this.gui.operateur=undefined;
			break;
		default:
			if(isOperateur(element)){
				if(this.gui.operateur)
					this.gui.screen=(this.gui.screen+"").substring(0,(this.gui.screen+"").length-1);
				this.gui.operateur=element;
			}else
				this.gui.operateur=undefined;
		this.gui.screen+=element;
			calc(this);
			break;
		}
	};
	this.setOn=function(){
		this.gui.on=true;
		this.screen="0";
		this.result=undefined;
	};
};
module.exports=calcService;
},{}],25:[function(require,module,exports){
var truncate= function () {
    return function (text, length, end) {
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length-end.length) + end;
        }

    };
};
module.exports=truncate;
},{}],26:[function(require,module,exports){
var prismApp=angular.module("PrismApp", ['ngSanitize','ngRoute']).run(['$location', '$rootElement','$rootScope', function ($location, $rootElement,$rootScope) {
    //$rootElement.off('click');
}]);

angular.module("PrismApp").controller("PrismController", ["$scope","download","$rootScope","$location","$routeParams",require("./prismController")]);
angular.module("PrismApp").directive("prismTabs", ["$http","$timeout","$sce",require("./directives/prismTabs")]);
angular.module("PrismApp").directive("tabHeader",require("./directives/tabHeader"));
angular.module("PrismApp").directive("tabContent",require("./directives/tabContent"));
angular.module('ng').service("download", ["$http","$window",require("./services/download")]);
module.exports=prismApp;
},{"./directives/prismTabs":27,"./directives/tabContent":28,"./directives/tabHeader":29,"./prismController":30,"./services/download":31}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
var tabContent=function(){
	return {
		restrict:"E",
		replace: true,
		templateUrl:"js/templates/tabContent.html"
	}
};

module.exports=tabContent;
},{}],29:[function(require,module,exports){
var tabHeader=function(){
	return {
		restrict:"E",
		replace: true,
		templateUrl:"js/templates/tabHeader.html"
	}
};
module.exports=tabHeader;
},{}],30:[function(require,module,exports){
var prismController=function($scope,download,$rootScope,$location,$routeParams) {
	$scope.tabs={"ex1":{"code":"ex1","title":"Exercice 1 : <b>Note<\/b>","description":"Double data-binding, utilisation des directives de base","href":"ex1","tabs":[{"id":"1","caption":"HTML","file":"ex1-note\/index.html","href":"tab1","download":"1","comment":"<br>\r\n<div class='alert alert-warning'>Attention, pour pouvoir fonctionner correctement, cette application doit intégrer les librairies suivantes :\r\n<ul>\r\n<li>Twitter bootstrap css<\/li>\r\n<li>angularJS main file<\/li>\r\n<\/ul>\r\n\r\n<\/div>","exercice":{},"values":[]},{"id":"2","caption":"Javascript","file":"ex1-note\/noteController.js","href":"tab2","download":"1","comment":"","exercice":{},"values":[]},{"id":"6","caption":"Css","file":"ex1-note\/css.css","href":"tab3","download":"1","comment":"","exercice":{},"values":[]}],"values":[]},"ex2":{"code":"ex2","title":"Exercice 2 : <b>Sélection de services<\/b>","description":"Créer un module et un contrôleur, \r\nUtiliser des directives Angular, \r\nMettre en oeuvre le Data-binding","href":"ex2","tabs":[{"id":"3","caption":"HTML","file":"ex2-services\/index.html","href":"tab1","download":"1","comment":"","exercice":{},"values":[]},{"id":"4","caption":"Javascript","file":"ex2-services\/servicesController.js","href":"tab2","download":"1","comment":"","exercice":{},"values":[]},{"id":"5","caption":"Css","file":"ex2-services\/css.css","href":"tab3","download":"1","comment":"","exercice":{},"values":[]}],"values":[]},"ex3":{"code":"ex3","title":"Exercice 3 : <b>Choix multiples<\/b>","description":"Créer un module et un contrôleur\r\nUtiliser des directives Angular\r\nMettre en oeuvre le Data-binding","href":"ex3","tabs":[{"id":"7","caption":"HTML","file":"ex3-choixMultiples\/index.html","href":"tab1","download":"1","comment":"","exercice":{},"values":[]},{"id":"8","caption":"Javascript","file":"ex3-choixMultiples\/choixMultiplesController.js","href":"tab2","download":"1","comment":"","exercice":{},"values":[]},{"id":"9","caption":"Css","file":"ex3-choixMultiples\/css.css","href":"tab3","download":"1","comment":"","exercice":{},"values":[]}],"values":[]},"ex4":{"code":"ex4","title":"Exercice 4 : <b>Gestion des contacts<\/b>","description":"Utiliser la directive <b>ngRepeat<\/b><br>\r\nUtiliser la validation des formulaires<br>\r\nCréer des directives simples","href":"ex4","tabs":[{"id":"10","caption":"HTML","file":"ex4-contacts\/contact.html","href":"tab1","download":"1","comment":"","exercice":{},"values":[]},{"id":"11","caption":"Template ContactElem","file":"ex4-contacts\/templates\/v_contact.html","href":"tab2","download":"1","comment":"","exercice":{},"values":[]},{"id":"12","caption":"Template frmContactElem","file":"ex4-contacts\/templates\/v_frmContact.html","href":"tab3","download":"1","comment":"","exercice":{},"values":[]},{"id":"13","caption":"Directives","file":"ex4-contacts\/app\/contactsDirectives.js","href":"tab4","download":"1","comment":"","exercice":{},"values":[]},{"id":"14","caption":"Filtres","file":"ex4-contacts\/app\/contactsFilters.js","href":"tab5","download":"1","comment":"","exercice":{},"values":[]},{"id":"15","caption":"Contrôleur","file":"ex4-contacts\/app\/contactsControllers.js","href":"tab6","download":"1","comment":"","exercice":{},"values":[]}],"values":[]},"ex5":{"code":"ex5","title":"Exercice 5 : <b>Convertisseur de devises<\/b>","description":"Utiliser des services Angular existants (<b>$http<\/b>)<br>Mettre en oeuvre l'injection de dépendance<br>Créer des directives","href":"ex5","tabs":[{"id":"16","caption":"HTML","file":"ex5-currency\/index.html","href":"tab1","download":"1","comment":"<br>\r\n<div class='alert alert-warning'>Attention, pour pouvoir fonctionner correctement, cette application doit intégrer les librairies suivantes :\r\n<ul>\r\n<li>Twitter bootstrap css file<\/li>\r\n<li>angularJS main file<\/li>\r\n<li>abgularJS cookie file (angular-cookies.js)<\/li>\r\n<\/ul>\r\n\r\n<b><u>Ressources :<\/u><\/b>\r\n<ul>\r\n<li><a href='ex5-currency\/img\/loader.gif' target='_self'>img\/loader.gif<\/a><\/li>\r\n<li><a href='ex5-currency\/app\/data\/currencymap.json' target='_blank'>app\/data\/currencymap.json<\/a><\/li>\r\n<\/ul>\r\n\r\n<\/div>","exercice":{},"values":[]},{"id":"17","caption":"Template","file":"ex5-currency\/templates\/v_histo.html","href":"tab2","download":"1","comment":"","exercice":{},"values":[]},{"id":"20","caption":"Directives","file":"ex5-currency\/app\/currencyDirectives.js","href":"tab3","download":"1","comment":"","exercice":{},"values":[]},{"id":"21","caption":"Contrôleur","file":"ex5-currency\/app\/currencyControllers.js","href":"tab4","download":"1","comment":"","exercice":{},"values":[]}],"values":[]},"ex6":{"code":"ex6","title":"Exercice 6 : <b>Calculatrice<\/b>","description":"Créer un service (moteur de la calculatrice)<br>Utiliser un service (Injection de dépendance)<br>Créer des directives","href":"ex6","tabs":[{"id":"22","caption":"HTML","file":"ex6-calc\/index.html","href":"tab1","download":"1","comment":"<br>\r\n<div class='alert alert-warning'>Attention, pour pouvoir fonctionner correctement, cette application doit intégrer les librairies suivantes :\r\n<ul>\r\n<li>Twitter bootstrap css file<\/li>\r\n<li>angularJS main file<\/li>\r\n<li>abgularJS cookie file (angular-cookies.js)<\/li>\r\n<\/ul>\r\n\r\n<\/div>","exercice":{},"values":[]},{"id":"23","caption":"CSS","file":"ex6-calc\/css\/calc.css","href":"tab2","download":"1","comment":"","exercice":{},"values":[]},{"id":"24","caption":"Service","file":"ex6-calc\/app\/calcService.js","href":"tab3","download":"1","comment":"","exercice":{},"values":[]},{"id":"25","caption":"Directive","file":"ex6-calc\/app\/calcDirectives.js","href":"tab4","download":"1","comment":"","exercice":{},"values":[]},{"id":"26","caption":"Contrôleur","file":"ex6-calc\/app\/calcControllers.js","href":"tab5","download":"1","comment":"","exercice":{},"values":[]}],"values":[]}};
	$scope.activeTabs=$scope.tabs[$routeParams.ex];
	
	$scope.downloadAll=function(tabs,ex){
		var zip = new JSZip();
		for(i in tabs){
			if(eval(tabs[i].download)==true){
				//download.downloadFile(tabs[i].file);
				zip.file(tabs[i].file,angular.element('<textarea />').html(tabs[i].content).text());
			}
		}
		var content = zip.generate({type:"arraybuffer"});
		download.downloadFile(ex+".zip",content);
	};

	$scope.isRunning=function(){
		return $location.path().indexOf("run")==-1 && $location.path().indexOf("ex")>-1;
	}
};
module.exports=prismController;
},{}],31:[function(require,module,exports){
var download=function($http,$window) {
	var saveBlob=function(filename,data,contentType,octetStreamMime){
		var success=false;
		try{
			// Try using msSaveBlob if supported
			console.log("Trying saveBlob method ...");
			var blob = new Blob([data], { type: contentType });
			if(navigator.msSaveBlob)
				navigator.msSaveBlob(blob, filename);
			else {
				// Try using other saveBlob implementations, if available
				var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
				if(saveBlob === undefined) throw "Not supported";
				saveBlob(blob, filename);
			}
			console.log("saveBlob succeeded");
			success = true;
		} catch(ex){
			console.log("saveBlob method failed with the following exception:");
			console.log(ex);
		}

		if(!success){
			// Get the blob url creator
			var urlCreator = $window.URL || $window.webkitURL || $window.mozURL || $window.msURL;
			if(urlCreator){
				// Try to use a download link
				var link = document.createElement('a');
				if('download' in link){
					// Try to simulate a click
					try{
						// Prepare a blob URL
						console.log("Trying download link method with simulated click ...");
						var blob = new Blob([data], { type: contentType });
						var url = urlCreator.createObjectURL(blob);
						link.setAttribute('href', url);

						// Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
						link.setAttribute("download", filename);

						// Simulate clicking the download link
						var event = document.createEvent('MouseEvents');
						event.initMouseEvent('click', true, true, $window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
						link.dispatchEvent(event);
						console.log("Download link method with simulated click succeeded");
						success = true;

					} catch(ex) {
						console.log("Download link method with simulated click failed with the following exception:");
						console.log(ex);
					}
				}

				if(!success){
					// Fallback to window.location method
					try{
						// Prepare a blob URL
						// Use application/octet-stream when using window.location to force download
						console.log("Trying download link method with window.location ...");
						var blob = new Blob([data], { type: octetStreamMime });
						var url = urlCreator.createObjectURL(blob);
						$window.location = url;
						console.log("Download link method with window.location succeeded");
						success = true;
					} catch(ex) {
						console.log("Download link method with window.location failed with the following exception:");
						console.log(ex);
					}
				}
			}
		}

		if(!success){
			// Fallback to window.open method
			console.log("No methods worked for saving the arraybuffer, using last resort window.open");
			$window.open(httpPath, '_blank', '');
		}
	};
	this.downloadFile = function(httpPath,data) {
		var octetStreamMime = 'application/octet-stream';
		var filename =httpPath;
		var contentType=octetStreamMime;
		
		if(angular.isUndefined(data)){
			// Use an arraybuffer
			$http.get(httpPath, { responseType: 'arraybuffer' })
			.success( function(data, status, headers) {
				// Get the headers
				headers = headers();
				// Get the filename from the x-filename header or default to "download.bin"
				filename = headers['x-filename'] || httpPath.split('/').pop() || 'download.bin';
				// Determine the content type from the header or default to "application/octet-stream"
				contentType = headers['content-type'] || octetStreamMime;
				saveBlob(filename, data, contentType, octetStreamMime);
			})
			.error(function(data, status) {
				console.log("Request failed with status: " + status);
			});
		}else{
			saveBlob(filename, data, contentType, octetStreamMime);
		}
	};
};
module.exports=download;
},{}],32:[function(require,module,exports){
var routes=function($routeProvider,$locationProvider) {
	       $routeProvider.
	           when('/ex1', {
	   templateUrl: 'js/ex1-note/index.html',
	   controller: 'NoteController'
	   }).when('/ex2', {
	   templateUrl: 'js/ex2-services/index.html',
	   controller: 'ServicesController'
	   }).when('/ex3', {
	   templateUrl: 'js/ex3-choixMultiples/index.html',
	   controller: 'ListesController'
	   }).when('/ex4', {
	   templateUrl: 'js/ex4-contacts/contact.html',
	   controller: 'ContactController'
	   }).when('/ex5', {
	   templateUrl: 'js/ex5-currency/index.html',
	   controller: 'currencyController'
	   }).when('/ex6', {
	   templateUrl: 'js/ex6-calc/index.html',
	   controller: 'calcController'
	   }).when('/home', {
	   templateUrl: 'templates/home.html',
	   controller: 'RouteController'
	   }).when('/run/:ex', {
	   templateUrl: 'templates/prism.html',
	   controller: 'PrismController'
	   }).otherwise({
		redirectTo: '/home'
	       	});
	       if(window.history && window.history.pushState){
	    	    $locationProvider.html5Mode(true);
	    	  }
	   };
	   module.exports=routes;
},{}]},{},[1]);
