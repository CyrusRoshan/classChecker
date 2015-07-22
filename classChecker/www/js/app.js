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
	//console.log($scope.tempClassList.length);
	if($scope.tempClassList.length > 0){
		//console.log("A");
		//console.log($scope.tempClassList);
		$rootScope.classList = $scope.tempClassList;
	}
	else{
		//console.log("B");
		//console.log($scope.tempClassList);
		$rootScope.classList =
			[
			{name: "Example Class", section: "Section", number: "Number", schedule: "Scheduled Times", seats: "Seats/Seats"}
		];
	}

	$rootScope.doRefresh = function() {

		//console.log('Refreshing!');
		$timeout( function() {
			//simulate async response
			for(i=0; i<$rootScope.classList.length; i++){
				if(($rootScope.classList[i].section == "Must Fetch") || ($rootScope.classList[i].number == "Must Fetch")){
					if($rootScope.classList[i].section == "Must Fetch"){
						console.log(i);
						var year = $rootScope.classList[i].term.split(" ")[1].slice(2, 4);
						var number = $rootScope.classList[i].number;
						var term = $rootScope.classList[i].term.split(" ")[0];
						if (term == "Fall"){
							term = "f";
						}
						else if(term == "Spring"){
							term = "s";
						}
						else if(term == "Summer"){
							term = "u";
						}

						//console.log("asdfds");
						//console.log(number);
						//console.log(year);
						//console.log(term);
						//console.log('http://coursebook.utdallas.edu/' + number + '/term_' + year + term + '?');

						//console.log(i);
						var index = i;
						$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://coursebook.utdallas.edu/' + number + '/term_' + year + term + '?') + '&callback=?', function(data){
							var i = index;
							//for some reason the above function changes i to 2 when i is 0. Haven't tested for other values, but the above line should fix it.

							//console.log(i);
							var string = 'title="View details for section ';
							data = data.contents;

							//console.log(data.indexOf(string));
							var urlAddon = data.slice(data.indexOf(string) + string.length, data.indexOf(string) + string.length + 20).split('"')[0];

							console.log(i);
							console.log($rootScope.classList);
							console.log($rootScope.classList[i]);

							$rootScope.classList[i].urlAddon = urlAddon;

							$rootScope.classList[i].section = urlAddon.split(".")[0].slice(0, urlAddon.split(".")[0].length - 4).toUpperCase() + " " + urlAddon.split(".")[0].slice(urlAddon.split(".")[0].length - 4, urlAddon.split(".")[0].length) + "." + urlAddon.split(".")[1];

							$rootScope.classList[i]

							$localstorage.setObject('classList', $rootScope.classList);
			console.log($localstorage.getObject('classList'));

							console.log($rootScope.classList);

							$rootScope.$apply();
						});


					}
					else if($rootScope.classList[i].number == "Must Fetch"){
						var year = $rootScope.classList[i].term.split(" ")[1].slice(2, 4);
						var number = $rootScope.classList[i].number;
						var term = $rootScope.classList[i].term.split(" ")[0].slice(2, 4);
						if (term == "Fall"){
							term = "f";
						}
						else if(term == "Spring"){
							term = "s";
						}
						else if(term == "Summer"){
							term = "u";
						}

						$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://coursebook.utdallas.edu/clips/clip-section.zog?id=' + section + '/term_' + year + term + '?') + '&callback=?', function(data){
							console.log(data.contents);
						});
					}
				}
			}

			//$rootScope.classList.unshift({name: Math.floor(Math.random() * 1000), section: Math.floor(Math.random() * 1000), number: Math.floor(Math.random() * 1000), schedule: Math.floor(Math.random() * 1000), seats: Math.floor(Math.random() * 1000)});

			//Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');

		}, 500);

	};

});
