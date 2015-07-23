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
			{name: "Example Class", section: "Section", number: "Number", schedule: "Scheduled Times", seats: "Seats/Seats", lastUpdate: "Never"}
		];
	}

	$rootScope.doRefresh = function() {

		//console.log('Refreshing!');
		$timeout( function() {
			//simulate async response
			var data = "";
			for(i=0; i<$rootScope.classList.length;i=i){
				data[i] = "";
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

						var index = i;
						console.log("prea" + i);
						$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://coursebook.utdallas.edu/' + number + '/term_' + year + term + '?') + '&callback=?', function(data){
							var i = index;
							console.log("a" + i);
							//for some reason the above function changes i to 2 when i is 0. Haven't tested for other values, but the above line should fix it.

							var string = 'title="View details for section ';
							data[i] = data.contents;

							var urlAddon = data[i].slice(data[i].indexOf(string) + string.length, data[i].indexOf(string) + string.length + 20).split('"')[0];

							$rootScope.classList[i].urlAddon = urlAddon;

							$rootScope.classList[i].section = urlAddon.split(".")[0].slice(0, urlAddon.split(".")[0].length - 4).toUpperCase() + " " + urlAddon.split(".")[0].slice(urlAddon.split(".")[0].length - 4, urlAddon.split(".")[0].length) + "." + urlAddon.split(".")[1];

							$localstorage.setObject('classList', $rootScope.classList);
							$rootScope.$apply();
						});
					}

					else if($rootScope.classList[i].number == "Must Fetch"){
						var year = $rootScope.classList[i].term.split(" ")[1].slice(2, 4);
						var section = $rootScope.classList[i].section.split(" ")[0].toLowerCase() + $rootScope.classList[i].section.split(" ")[1];
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

						var urlAddon = section + "." + year + term;
						$rootScope.classList[i].urlAddon = urlAddon;

						var index = i;
						console.log("preb" + i);
						$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://coursebook.utdallas.edu/' + section + "." + year + term) + '&callback=?', function(data){
							var i = index;
							console.log("b" + i);
							//for some reason the above function changes i to 2 when i is 0. Haven't tested for other values, but the above line should fix it.

							var string = '</a><br />';
							//the above text happens in 3 locations, but luckily we only need the first one

							data[i] = data.contents;

							var number = data[i].slice(data[i].indexOf(string) + string.length, data[i].indexOf(string) + string.length + 5);

							$rootScope.classList[i].number = number;

							$localstorage.setObject('classList', $rootScope.classList);
							$rootScope.$apply();
						});
						/*$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://coursebook.utdallas.edu/clips/clip-section.zog?id=' + section + "." + year + term) + '&callback=?', function(data){
							console.log(data.contents);
						});*/
						//turns out the above code won't work because whateverorigin has trouble accepting query strings
						//alternative: use only the other url and fetch the part that shows the percentage filled
						//then, display percentage filled as opposed to total seats.
					}
				}

				var index = i;
				console.log("pre c" + i);
				console.log($rootScope.classList[i].urlAddon);
				$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://coursebook.utdallas.edu/' + $rootScope.classList[i].urlAddon) + '&callback=?', function(data){
					var i = index;
					console.log("c" + i);
					//for some reason the above function changes i to 2 when i is 0. Haven't tested for other values, but the above line should fix it.

					var string1 = 'transparent; " title="';
					var string2 = '</a><br /></td><td>';

					data[i] = data.contents;

					var seats = data[i].slice(data[i].indexOf(string1) + string1.length, data[i].indexOf(string1) + string1.length + 15).split('"')[0];

					var schedule = data[i].slice(data[i].indexOf(string2) + string2.length, data[i].indexOf(string2) + string2.length + 60).split('<br /><a href="')[0].replace("&nbsp;", " ").replace("&nbsp;", " ").replace(" : ", " ");

					var lastUpdate = new Date().getMonth() + '/' + new Date().getDay() + '/' + new Date().getFullYear() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();

					if(parseInt(seats.split("%")[0]) < 100){
						var open = "open";
					}

					$rootScope.classList[i].schedule = schedule;
					$rootScope.classList[i].seats = seats;
					$rootScope.classList[i].lastUpdate = lastUpdate;
					$rootScope.classList[i].open = open;

					console.log(schedule + seats + lastUpdate + open);

					$localstorage.setObject('classList', $rootScope.classList);
					$rootScope.$apply();
				});

				i++;
				if(i > $rootScope.classList.length){
					$scope.$broadcast('scroll.refreshComplete');
				}

			}

			//Stop the ion-refresher from spinning

		}, 500);

	};

});
