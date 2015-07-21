var app = angular.module('ionicApp', ['ionic', 'ionic.utils'])
var utilities = angular.module('ionic.utils', [])

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

//save data from adding classes
utilities.factory('$localstorage', ['$window', function($window) {
	return {
		set: function(key, value) {
			$window.localStorage[key] = value;
		},
		get: function(key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},
		setObject: function(key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key) {
			return JSON.parse($window.localStorage[key] || '{}');
		}
	}
}]);

//main screen's class displayer
app.controller('classesCtrl', function($scope, $timeout, $rootScope, $localstorage){

	//$localstorage.setObject('classList', {});
	//uncomment the above line to clear data

	$scope.tempClassList = $localstorage.getObject('classList');
	console.log($scope.tempClassList.length);
	if($scope.tempClassList.length > 0){
		console.log("A");
		console.log($scope.tempClassList);
		$rootScope.classList = $scope.tempClassList;
	}
	else{
		console.log("B");
		console.log($scope.tempClassList);
		$rootScope.classList =
			[
			{name: "First Run", section: "Section", number: "Number", schedule: "Scheduled Times", seats: "Seats/Seats"}
		];
	}

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
