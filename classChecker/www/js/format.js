$( document ).ready(function() {
	formatAddClassButton();
});

function formatAddClassButton(){


	if(ionic.Platform.isIOS()){
		if( $(".addClassButton").width() > $(".addClassButton").height() ){
			$(".addClassButton").css({
				"height": $(".addClassButton").width() + "px",
				"bottom": $(".tab-nav.tabs").height() + 20 + "px",
			});
		}
		else{
			$(".addClassButton").css({
				"width": $(".addClassButton").height() + "px",
				"bottom": $(".tab-nav.tabs").height() + 20 + "px",
			});
		}
	}

	if(ionic.Platform.isAndroid()){
		if( $(".addClassButton").width() > $(".addClassButton").height() ){
			$(".addClassButton").css({
				"height": $(".addClassButton").width() + "px",
				"bottom": 20 + "px",
			});
		}
		else{
			$(".addClassButton").css({
				"width": $(".addClassButton").height() + "px",
				"bottom": 20 + "px",
			});
		}
	}

	$("<style>.addClassButton::before{font-size: " + $('.addClassButton').height() / 2 + "px !important}</style>").appendTo("head");
}
