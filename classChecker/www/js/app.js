var app = angular.module('ionicApp', ['ionic'])

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

.controller('HomeTabCtrl', function($scope, $ionicModal, $rootScope, $ionicPopup) {
	//console.log('HomeTabCtrl');
	formatAddClassButton();
	$ionicModal.fromTemplateUrl('templates/addClassForm.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
		//console.log(modal);
	});
	$scope.openModal = function(){
		$scope.modal.show();
	}
	$scope.closeModal = function(){
		$scope.modal.hide();
	}
	$scope.addClass = function(){
		//console.log($rootScope.error());
		if($rootScope.error() == ""){
			$rootScope.saveAddedClassData();
			$scope.modal.hide();
		}
		else{
			var alertError = $ionicPopup.alert({
				title: 'Error!',
				template: 'Please properly format your class section or class number, as shown in the placeholder text and picture.'
			});
			alertError.then(function(){
				//console.log('Error shown to user');
			});
		}
	}

});


app.controller('classesCtrl', function($scope, $timeout, $rootScope){
	//console.log($localstorage.getObject('post'));
	$rootScope.classList =
		[
		{name: "asdfsd", section: "section", number: 129329329, schedule: "thursdays n stuff", seats: "100/1000"}
	];
	//console.log($scope.classList[1].name);
	$scope.doRefresh = function() {

		//console.log('Refreshing!');
		$timeout( function() {
			//simulate async response
			$rootScope.classList.unshift({name: Math.floor(Math.random() * 1000), section: Math.floor(Math.random() * 1000), number: Math.floor(Math.random() * 1000), schedule: Math.floor(Math.random() * 1000), seats: Math.floor(Math.random() * 1000)});

			//Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');

		}, 1000);

	};

});
