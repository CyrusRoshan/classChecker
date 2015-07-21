//save data from adding classes
function saveAddedClassData(){
	var post = {
		name: 123,
		text: 'Today was a good day'
	};

	window.localStorage['post']

	var post = JSON.parse(window.localStorage['post'] || '{}');
}


//the addClass modal's angular code:
app.controller('addClassController', function($scope, $rootScope) {
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
		$scope.defaultTerm = "Spring " + currentYear.toString();
		$scope.terms = ["Fall " + lastYear, $scope.defaultTerm, "Summer " + currentYear];
	}
	else if((decimalDM >= 3.17) && (decimalDM < 8.12)){
		//must be Spring registration time
		$scope.defaultTerm = "Summer " + currentYear.toString();
		$scope.terms = ["Spring " + currentYear, $scope.defaultTerm, "Fall " + nextYear];
	}
	else if((decimalDM >= 8.12) && (decimalDM < 11.01)){
		//must be Spring registration time
		$scope.defaultTerm = "Fall " + currentYear.toString();
		$scope.terms = ["Summer " + currentYear, $scope.defaultTerm, "Spring " + nextYear];
	}



	$rootScope.error = function error(){
		//console.log($scope.addClass.sectionNumber);
		if($scope.addClass.sectionNumber === undefined){
			//console.log("A");
			return "error";
		}
		if(($scope.addClass.sectionNumber.toString().length == 5) && (parseInt($scope.addClass.sectionNumber).toString().length == 5)){
			//console.log("B");
			return "";
		}
		else if((isNaN(parseInt($scope.addClass.sectionNumber.split(" ")[0])) === true) && ($scope.addClass.sectionNumber.split(" ")[1].split(".")[0].length == 4) && (parseInt($scope.addClass.sectionNumber.split(" ")[1].split(".")[0]).toString().length == 4)  && ($scope.addClass.sectionNumber.split(" ")[1].split(".")[0].length == 4) && ($scope.addClass.sectionNumber.split(" ")[1].split(".")[1].length == 3)){
			//console.log("C");
			return "";
		}
		else{
			//console.log("D");
			return "error";
		}
	};

	$rootScope.saveAddedClassData = function saveAddedClassData(){
		console.log("ayy it works");
	}
});
