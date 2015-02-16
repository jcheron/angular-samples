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

