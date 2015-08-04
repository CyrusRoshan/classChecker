

//the addClass modal's angular code:
app.controller('addClassController', function($scope, $timeout, $rootScope, $localstorage, $ionicPopup) {
	if(ionic.Platform.isIOS()){
		//are you serious ios, do you think you're special?

		var currentDate = new Date().toLocaleDateString();
		var currentMonth = currentDate.split(" ")[0];
		var currentDay = parseInt(currentDate.split(" ")[1].slice(0, - 1));
		var currentYear = parseInt(currentDate.split(" ")[2]);
		var nextYear = currentYear + 1;
		var lastYear = currentYear - 1;
		var monthList = ["January", "February", "March", "April", "May", "June", "July", "September", "October", "November", "December"];

		for(i=0;i<11;i++){
			if(currentMonth	== monthList[i]){
				currentMonth = i;
			}
		}

	}

	else{
		var currentDate = new Date().toLocaleDateString(); //in format M(M)/D(D)/YYYY
		var currentMonth = parseInt(currentDate.split("/")[0]);
		var currentDay = parseInt(currentDate.split("/")[1]);
		var currentYear = parseInt(currentDate.split("/")[2]);
		var nextYear = currentYear + 1;
		var lastYear = currentYear - 1;
	}
	/*
	semesters at UTD:

	Fall year x: Aug 24
	Middle: Nov 1 x
	Spring year x+1: Jan 11
	Middle: Mar 17 x+1
	Summer year x+1: May 23
	Middle: Aug 12 x+1
	Fall year x+1: Aug 24
	*/

	var decimalDM = currentMonth + currentDay/10;
	if((decimalDM >= 11.01) || (decimalDM < 3.17)){
		//must be Spring registration time
		$scope.enteredTerm = "Spring " + currentYear.toString();
		$scope.defaultTerm = $scope.enteredTerm;
		$scope.terms = ["Fall " + lastYear, $scope.defaultTerm, "Summer " + currentYear];
	}
	else if((decimalDM >= 3.17) && (decimalDM < 8.12)){
		//must be Spring registration time
		$scope.enteredTerm = "Summer " + currentYear.toString();
		$scope.defaultTerm = $scope.enteredTerm;
		$scope.terms = ["Spring " + currentYear, $scope.defaultTerm, "Fall " + nextYear];
	}
	else if((decimalDM >= 8.12) && (decimalDM < 11.01)){
		//must be Spring registration time
		$scope.enteredTerm = "Fall " + currentYear.toString();
		$scope.defaultTerm = $scope.enteredTerm;
		$scope.terms = ["Summer " + currentYear, $scope.defaultTerm, "Spring " + nextYear];
	}



	$rootScope.error = function error(){
		//console.log($scope.addClass.sectionNumber);
		if($scope.addClass.sectionNumber === undefined){
			//console.log("A");
			return "error";
		}
		else if(($scope.addClass.sectionNumber.toString().length == 5) && (parseInt($scope.addClass.sectionNumber).toString().length == 5)){
			//console.log("B");
			return "";
		}
		else if((isNaN(parseInt($scope.addClass.sectionNumber.split(" ")[0])) === true) && ($scope.addClass.sectionNumber.split(" ")[1].split(".")[0].length == 4) && (parseInt($scope.addClass.sectionNumber.split(" ")[1].split(".")[0]).toString().length == 4)  && ($scope.addClass.sectionNumber.split(" ")[1].split(".")[0].length == 4) && ($scope.addClass.sectionNumber.split(" ")[1].split(".")[1].length == 3) && ($scope.addClass.sectionNumber.split(" ")[2] === undefined) && ($scope.addClass.sectionNumber.split(" ")[1].split(".")[2] === undefined)){
			//console.log("C");
			return "";
		}
		else{
			//console.log("D");
			return "error";
		}
	};

	$rootScope.saveAddedClassData = function saveAddedClassData(){
		if($rootScope.classList[$rootScope.classList.length - 1].name == "Example Class"){
			$rootScope.classList.shift();
		}
		if($scope.addClass.sectionNumber.toString().length == 5){
			$scope.addClass.snType = "number";
			$rootScope.classList.unshift({
				name: $scope.addClass.name,
				section: "Must Fetch",
				number: $scope.addClass.sectionNumber,
				schedule: "Must Fetch",
				seats: "Must Fetch",
				term: $scope.enteredTerm,
				urlAddon: "Must Fetch",
				lastUpdate: "Never",
				open: "Must Fetch"
			});
		}
		else{
			$scope.addClass.snType = "section";
			$rootScope.classList.unshift({
				name: $scope.addClass.name,
				section: $scope.addClass.sectionNumber.toUpperCase(),
				number: "Must Fetch",
				schedule: "Must Fetch",
				seats: "Must Fetch",
				term: $scope.enteredTerm,
				urlAddon: "Must Fetch",
				lastUpdate: "Never",
				open: "Must Fetch"
			});
		}

		$timeout(function(){
			$scope.addClass.name = "";
			$scope.addClass.sectionNumber = "";
			$scope.addClass.snType = "";
			$scope.enteredTerm = $scope.defaultTerm;
			$scope.$apply();
			$localstorage.setObject('classList', $rootScope.classList);
			//console.log($localstorage.getObject('classList'));
		});

	}
});

app.controller('masterController', function($scope, $timeout, $rootScope, $localstorage, $ionicPopup) {
	//kind of redundant, yeah.

	$rootScope.clearClasses = function() {
		var confirmDelete = $ionicPopup.confirm({
			title: 'Delete ALL Classes?',
			template: 'Are you sure you want to delete all classes? This is irreversible.',
			cancelText: 'Cancel', // String (default: 'Cancel'). The text of the Cancel button.
			cancelType: 'button-default', // String (default: 'button-default'). The type of the Cancel button.
			okText: 'Delete!', // String (default: 'OK'). The text of the OK button.
			okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
		});
		confirmDelete.then(function(res) {
			if(res) {
				$rootScope.classList =
					[
					{name: "Example Class", section: "Section", number: "Number", schedule: "Scheduled Times", term: "Term", seats: "Percent Filled", lastUpdate: "Never"}
				];
				$localstorage.setObject('classList', {});
			} else {
				console.log("NOOOOO");
				console.log(res);
			}
		});
	}

	$rootScope.showDeleteClass = "";
	$rootScope.leftButtonIcon = "ion-minus-round";

	$rootScope.toggleClassRemoval = function(){
		if($rootScope.leftButtonIcon == "ion-minus-round"){
			$rootScope.leftButtonIcon = "ion-close-round";
			$rootScope.showDeleteClass = "showDeleteClass";

		}
		else{
			$rootScope.leftButtonIcon = "ion-minus-round";
			$rootScope.showDeleteClass = "";
		}
	}

	$rootScope.deleteThisClass = function($index){
		$rootScope.classList.splice($index, 1);
		if($rootScope.classList.length == 0){
			$rootScope.classList =
				[
				{name: "Example Class", section: "Section", number: "Number", schedule: "Scheduled Times", term: "Term", seats: "Percent Filled", lastUpdate: "Never"}
			];
		}
		$localstorage.setObject('classList', $rootScope.classList);
	}

});
