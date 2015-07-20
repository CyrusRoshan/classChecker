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
app.controller('addClassController', function() {

	var currentDate = new Date().toLocaleDateString(); //in format M(M)/D(D)/YYYY
	var currentMonth = parseInt(currentDate.split("/")[0]);
	var currentDay = parseInt(currentDate.split("/")[1]);
	var currentYear = parseInt(currentDate.split("/")[2]);
	var nextYear = currentYear + 1;
	var lastYear = currentYear - 1;
	/*semesters at UTD:
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
		this.defaultTerm = "Spring " + currentYear.toString();
		this.terms = ["Fall " + lastYear, this.defaultTerm, "Summer " + currentYear];
	}
	else if((decimalDM >= 3.17) && (decimalDM < 8.12)){
		//must be Spring registration time
		this.defaultTerm = "Summer " + currentYear.toString();
		this.terms = ["Spring " + currentYear, this.defaultTerm, "Fall " + nextYear];
	}
	else if((decimalDM >= 8.12) && (decimalDM < 11.01)){
		//must be Spring registration time
		this.defaultTerm = "Fall " + currentYear.toString();
		this.terms = ["Summer " + currentYear, this.defaultTerm, "Spring " + nextYear];
	}



	this.error = function error() {
		if(this.sectionNumber === undefined){
			return "error";
		}
		if((this.sectionNumber.toString().length == 5) && (parseInt(this.sectionNumber).toString().length == 5)){
			return "";
		}
		else if((isNaN(parseInt(this.sectionNumber.split(" ")[0])) === true) && (this.sectionNumber.split(" ")[1].split(".")[0].length == 4) && (parseInt(this.sectionNumber.split(" ")[1].split(".")[0]).toString().length == 4)  && (this.sectionNumber.split(" ")[1].split(".")[0].length == 4) && (this.sectionNumber.split(" ")[1].split(".")[1].length == 3)){
			return "";
		}
		else{
			return "error";
		}
	};

});
