$( document ).ready(function() {
	formatAddClassButton();
});

function formatAddClassButton(){

	var addClassWidth = $(".addClassButton").width();
	var addClassHeight = $(".addClassButton").height();
	if(ionic.Platform.isIOS()){
		var tabNavTabsHeight = $(".tab-nav.tabs").height();
		if( addClassWidth > addClassHeight ){
			$(".addClassButton").css({
				"height": addClassWidth + "px",
				"bottom": tabNavTabsHeight + 20 + "px",
			});
			$(".removeClassButton").css({
				"height": addClassWidth + "px",
				"bottom": tabNavTabsHeight + 20 + "px",
			});
		}
		else{
			$(".addClassButton").css({
				"width": addClassHeight + "px",
				"bottom": tabNavTabsHeight + 20 + "px",
			});
			$(".removeClassButton").css({
				"width": addClassHeight + "px",
				"bottom": tabNavTabsHeight + 20 + "px",
			});
		}
	}

	if(ionic.Platform.isAndroid()){
		if( addClassWidth > addClassHeight ){
			$(".addClassButton").css({
				"height": addClassWidth + "px",
				"bottom": 20 + "px",
			});
			$(".removeClassButton").css({
				"height": addClassWidth + "px",
				"bottom": 20 + "px",
			});
		}
		else{
			$(".addClassButton").css({
				"width": addClassHeight + "px",
				"bottom": 20 + "px",
			});
			$(".removeClassButton").css({
				"width": addClassHeight + "px",
				"bottom": 20 + "px",
			});
		}
	}

	$("<style>.addClassButton::before,.removeClassButton::before{font-size: " + $('.addClassButton').height() / 2 + "px !important}</style>").appendTo("head");
}
