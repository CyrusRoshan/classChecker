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
	formatAddClassButton();
	$ionicModal.fromTemplateUrl('templates/addClassForm.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.openModal = function(){
		$scope.modal.show();
	}
	$scope.closeModal = function(){
		$scope.modal.hide();
	}
	$scope.addClass = function(){
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
	if($scope.tempClassList.length > 0){
		$rootScope.classList = $scope.tempClassList;
		for(i=1;i<=$scope.tempClassList;i++){

		}
	}
	else{
		$rootScope.classList =
			[
			{name: "Example Class", section: "Section", number: "Number", schedule: "Scheduled Times", term: "Term", seats: "Percent Filled", lastUpdate: "Never"}
		];
	}

	$rootScope.doRefresh = function() {

		$scope.sectionDataFetch = function sectionDataFetch() {
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

			var index = i;
			$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://coursebook.utdallas.edu/' + number + '/term_' + year + term + '?') + '&callback=?', function(data){
				var i = index;
				//for some reason the above function changes i to 2 when i is 0. Haven't tested for other values, but the above line should fix it.

				var string = 'title="View details for section ';
				data[i] = data.contents;

				if (data[i].indexOf(string) != -1){

					var urlAddon = data[i].slice(data[i].indexOf(string) + string.length, data[i].indexOf(string) + string.length + 20).split('"')[0];

					$rootScope.classList[i].urlAddon = urlAddon;

					$rootScope.classList[i].section = urlAddon.split(".")[0].slice(0, urlAddon.split(".")[0].length - 4).toUpperCase() + " " + urlAddon.split(".")[0].slice(urlAddon.split(".")[0].length - 4, urlAddon.split(".")[0].length) + "." + urlAddon.split(".")[1];

					$localstorage.setObject('classList', $rootScope.classList);
					$rootScope.$apply();
				}
				else{
					$rootScope.classList[i].urlAddon = 'Error';
					$rootScope.classList[i].classError = true;
					$rootScope.classList[i].schedule = 'Class does not exist.';
					$rootScope.classList[i].seats = 'Error';
					$rootScope.classList[i].section = 'Error';
					$rootScope.classList[i].lastUpdate = 'Class does not exist.';
					$rootScope.classList[i].open = 'nonexistent';

					$localstorage.setObject('classList', $rootScope.classList);
					$rootScope.$apply();

					if(( (i) >= $rootScope.classList.length) && ($rootScope.classList[i].classError === true)){
						$rootScope.finishRefresh();
					}
				}
			});
		}

		$scope.numberDataFetch = function numberDataFetch() {

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
			$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://coursebook.utdallas.edu/' + section + "." + year + term) + '&callback=?', function(data){
				var i = index;
				//for some reason the above function changes i to 2 when i is 0. Haven't tested for other values, but the above line should fix it.

				var string = '</a><br />';
				//the above text happens in 3 locations, but luckily we only need the first one
				data[i] = data.contents;

				if (data[i].indexOf(string) != -1){
					var number = data[i].slice(data[i].indexOf(string) + string.length, data[i].indexOf(string) + string.length + 5);

					$rootScope.classList[i].number = number;

					$localstorage.setObject('classList', $rootScope.classList);
					$rootScope.$apply();
				}
				else{
					$rootScope.classList[i].urlAddon = 'Error';
					$rootScope.classList[i].classError = true;
					$rootScope.classList[i].schedule = 'Class does not exist.';
					$rootScope.classList[i].seats = 'Error';
					$rootScope.classList[i].number = 'Error';
					$rootScope.classList[i].lastUpdate = 'Class does not exist.';
					$rootScope.classList[i].open = 'nonexistent';

					$localstorage.setObject('classList', $rootScope.classList);
					$rootScope.$apply();

					if(( (i) >= $rootScope.classList.length) && ($rootScope.classList[i].classError === true)){
						$rootScope.finishRefresh();
					}
				}
			});
			/*$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://coursebook.utdallas.edu/clips/clip-section.zog?id=' + section + "." + year + term) + '&callback=?', function(data){
							console.log(data.contents);
						});*/
			//turns out the above code won't work because whateverorigin has trouble accepting query strings
			//alternative: use only the other url and fetch the part that shows the percentage filled
			//then, display percentage filled as opposed to total seats.
		}

		$scope.initialDataCheck = function initialDataCheck() {
			if($rootScope.classList[i].classError != true){
				if(($rootScope.classList[i].section == "Must Fetch") || ($rootScope.classList[i].number == "Must Fetch")){
					if($rootScope.classList[i].section == "Must Fetch"){
						$scope.sectionDataFetch();
					}

					else if($rootScope.classList[i].number == "Must Fetch"){
						$scope.numberDataFetch();
					}
				}
			}
		}

		$scope.getRepeatData = function getRepeatData(){
			if($rootScope.classList[i].classError != true){
				if($rootScope.classList[i].urlAddon == "Must Fetch"){
					if($rootScope.classList[i].number == "Must Fetch"){
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
						$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://coursebook.utdallas.edu/' + $rootScope.classList[i].urlAddon) + '&callback=?', function(data){
							var i = index;
							//for some reason the above function changes i to 2 when i is 0. Haven't tested for other values, but the above line should fix it.

							var string1 = 'transparent; " title="';
							var string2 = '</a><br /></td><td>';

							data[i] = data.contents.toString();

							if (data[i].indexOf(string1) != -1){
								var seats = data[i].slice(data[i].indexOf(string1) + string1.length, data[i].indexOf(string1) + string1.length + 15).split('"')[0];

								var schedule = data[i].slice(data[i].indexOf(string2) + string2.length, data[i].indexOf(string2) + string2.length + 60).split('<br /><a href="')[0].replace("&nbsp;", " ").replace("&nbsp;", " ").replace(" : ", " ");

								var lastUpdate = new Date().getMonth() + '/' + new Date().getDay() + '/' + new Date().getFullYear() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();

								if(parseInt(seats.split("%")[0]) < 100){
									var open = "open";
								}
								else{
									var open = "closed";
								}

								$rootScope.classList[i].schedule = schedule;
								$rootScope.classList[i].seats = seats;
								$rootScope.classList[i].lastUpdate = lastUpdate;
								$rootScope.classList[i].open = open;

								$localstorage.setObject('classList', $rootScope.classList);
								$rootScope.$apply();

								if(i >= $rootScope.classList.length - 1){
									$rootScope.finishRefresh();
								}

							}
							else{
								$rootScope.classList[i].urlAddon = 'Error';
								$rootScope.classList[i].classError = true;
								$rootScope.classList[i].schedule = 'Class does not exist.';
								$rootScope.classList[i].seats = 'Error';
								$rootScope.classList[i].section = 'Error';
								$rootScope.classList[i].lastUpdate = 'Class does not exist.';
								$rootScope.classList[i].open = 'nonexistent';

								$localstorage.setObject('classList', $rootScope.classList);
								$rootScope.$apply();

								if(( (i) >= $rootScope.classList.length) && ($rootScope.classList[i].classError === true)){
									$rootScope.finishRefresh();
								}
							}
						});

					}
					else{
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

						var urlAddon = number + "/" + year + term;
						$rootScope.classList[i].urlAddon = urlAddon;

						var index = i;
						$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://coursebook.utdallas.edu/' + $rootScope.classList[i].urlAddon) + '&callback=?', function(data){
							var i = index;
							//for some reason the above function changes i to 2 when i is 0. Haven't tested for other values, but the above line should fix it.

							var string1 = 'transparent; " title="';
							var string2 = '</a><br /></td><td>';

							data[i] = data.contents.toString();

							if (data[i].indexOf(string1) != -1){
								var seats = data[i].slice(data[i].indexOf(string1) + string1.length, data[i].indexOf(string1) + string1.length + 15).split('"')[0];

								var schedule = data[i].slice(data[i].indexOf(string2) + string2.length, data[i].indexOf(string2) + string2.length + 60).split('<br /><a href="')[0].replace("&nbsp;", " ").replace("&nbsp;", " ").replace(" : ", " ");

								var lastUpdate = new Date().getMonth() + '/' + new Date().getDay() + '/' + new Date().getFullYear() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();

								if(parseInt(seats.split("%")[0]) < 100){
									var open = "open";
								}
								else{
									var open = "closed";
								}

								$rootScope.classList[i].schedule = schedule;
								$rootScope.classList[i].seats = seats;
								$rootScope.classList[i].lastUpdate = lastUpdate;
								$rootScope.classList[i].open = open;

								$localstorage.setObject('classList', $rootScope.classList);
								$rootScope.$apply();

								if(i >= $rootScope.classList.length - 1){
									$rootScope.finishRefresh();
								}
							}
							else{
								$rootScope.classList[i].urlAddon = 'Error';
								$rootScope.classList[i].classError = true;
								$rootScope.classList[i].schedule = 'Class does not exist.';
								$rootScope.classList[i].seats = 'Error';
								$rootScope.classList[i].section = 'Error';
								$rootScope.classList[i].lastUpdate = 'Class does not exist.';
								$rootScope.classList[i].open = 'nonexistent';

								$localstorage.setObject('classList', $rootScope.classList);
								$rootScope.$apply();

								if(( (i) >= $rootScope.classList.length) && ($rootScope.classList[i].classError === true)){
									$rootScope.finishRefresh();
								}
							}
						});
					}
				}
				else{
					var index = i;
					$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://coursebook.utdallas.edu/' + $rootScope.classList[i].urlAddon) + '&callback=?', function(data){
						var i = index;
						//for some reason the above function changes i to 2 when i is 0. Haven't tested for other values, but the above line should fix it.

						var string1 = 'transparent; " title="';
						var string2 = '</a><br /></td><td>';

						data[i] = data.contents.toString();

						var seats = data[i].slice(data[i].indexOf(string1) + string1.length, data[i].indexOf(string1) + string1.length + 15).split('"')[0];

						var schedule = data[i].slice(data[i].indexOf(string2) + string2.length, data[i].indexOf(string2) + string2.length + 60).split('<br /><a href="')[0].replace("&nbsp;", " ").replace("&nbsp;", " ").replace(" : ", " ");

						var lastUpdate = new Date().getMonth() + '/' + new Date().getDay() + '/' + new Date().getFullYear() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();

						if(parseInt(seats.split("%")[0]) < 100){
							var open = "open";
						}
						else{
							var open = "closed";
						}

						$rootScope.classList[i].schedule = schedule;
						$rootScope.classList[i].seats = seats;
						$rootScope.classList[i].lastUpdate = lastUpdate;
						$rootScope.classList[i].open = open;

						$localstorage.setObject('classList', $rootScope.classList);
						$rootScope.$apply();

						if(i >= $rootScope.classList.length - 1){
							$rootScope.finishRefresh();
						}
					});
				}
			}
		}

		$scope.iterate = function iterate(){
			if(( (i) >= $rootScope.classList.length) && ($rootScope.classList[i].classError === true)){
				$rootScope.finishRefresh();
			}
			else if( i>= $rootScope.classList.length){
				$rootScope.finishRefresh();
			}
			//i++;
		}

		$rootScope.finishRefresh = function finishRefresh(){
			$scope.$broadcast('scroll.refreshComplete');
		}

		$timeout( function() {

			var data = "";
			for(i=0; i<$rootScope.classList.length;i++){
				data[i] = "";

				if($rootScope.classList[i].name == "Example Class"){
					//do nothing
					//i++;
					$rootScope.finishRefresh();
				}
				else{
					//$scope.initialDataCheck();
					//$scope.getRepeatData();
					//$scope.iterate();

					//$scope.iterate($scope.getRepeatData($scope.initialDataCheck()));

					$.when( $scope.initialDataCheck() ).done(function() {
						//console.log("checked initial data");
						$.when( $scope.getRepeatData() ).done(function() {
						//	console.log("got repeat data");
							$.when( $scope.iterate() ).done(function() {
						//		console.log("Iterated");
							});
						});
					});
				}
			}
			//$rootScope.finishRefresh();

		}, 500);

	};

});
