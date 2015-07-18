angular.module('ionicApp', ['ionic'])

	.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('tabs', {
		url: "/tab",
		abstract: true,
		templateUrl: "templates/tabs.html"
	})
		.state('tabs.home', {
		url: "/home",
		views: {
			'home-tab': {
				templateUrl: "templates/home.html",
				controller: 'HomeTabCtrl'
			}
		}
	})
		.state('tabs.about', {
		url: "/about",
		views: {
			'about-tab': {
				templateUrl: "templates/about.html"
			}
		}
	})
		.state('tabs.navstack', {
		url: "/navstack",
		views: {
			'about-tab': {
				templateUrl: "templates/nav-stack.html"
			}
		}
	})
		.state('tabs.contact', {
		url: "/contact",
		views: {
			'contact-tab': {
				templateUrl: "templates/contact.html"
			}
		}
	});


	$urlRouterProvider.otherwise("/tab/home");

})

	.controller('HomeTabCtrl', function($scope, $ionicModal) {
	console.log('HomeTabCtrl');
	formatAddClassButton();
	$ionicModal.fromTemplateUrl('templates/addClassForm.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
		console.log(modal);
		setTimeout(function(){console.log(modal);}, 2000);
	});
	$scope.openModal = function(){
		$scope.modal.show();
	}
	$scope.closeModal = function(){
		$scope.modal.hide();
	}
	$scope.addClass = function(){
		if(true){
			saveAddedClassData();
			$scope.modal.hide();
		}
		else{

		}
	}
});
