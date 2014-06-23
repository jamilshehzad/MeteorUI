Template.CompanyChart.rendered = function() {
	var companyId = this.data._id;
	VLXVisualizer(function(visualizer) {
		visualizer.loadData("Company", companyId);
	});
}

Template.CompanyChart.events({
	"hide.bs.modal": function() {
		$("#VLVChart").removeClass("shrink");
	},
	 
	 "click .firstFilter": function (event) {
		 NS4FilterClick(this,0)
	  },
	 
	 "click .secondFilter": function (event) {
		 NS4FilterClick(this,1)
	  },
	  
	  "click .functionLink": function (event) {
		  LinkFilterClick(this,0)
	  },
	  
	  "click .shareholderLink": function (event) {
		  LinkFilterClick(this,1)
	  }

});

var EUp = function(objTD) 
{
	//Make the calling Filter Button raised (unless disabled)
	if(objTD.className.search(/disabled/) > -1)
		return;
		
	var strClassName = "";
	if(objTD.className.search(/selected/) > -1)
		strClassName = "selected ";							
		strClassName += "filterButtonUp";
		objTD.className = strClassName;
}
var ENorm = function(objTD) 
{
	//Make the calling Filter Button normal (unless disabled)
	if(objTD.className.search(/disabled/) > -1)
		return;
		
	var strClassName = "";
	if(objTD.className.search(/selected/) > -1)
		strClassName = "selected ";						
		strClassName += "filterButton";
		objTD.className = strClassName;
}
var EDown = function(objTD) 
{
	//Make the calling Filter Button recessed (unless disabled)
	if(objTD.className.search(/disabled/) > -1) 
		return;
		
	var strClassName = "";
	if(objTD.className.search(/selected/) > -1)
		strClassName = "selected ";							
		strClassName += "filterButtonDown";
		objTD.className = strClassName;			  
}
var ShowSelectState = function(objTD, state) 
{
	//if (!netscape4)
	//{
	//Make the calling Filter Button Selected or Unselected (unless disabled)
		/*if(objTD.className.search(/disabled/) > -1)
			return;*/
		var strClassName = "";
		//alert(state);
		if(state)
			strClassName = "selected ";						
		strClassName += "filterButton";
		objTD.className = strClassName;
	//}
}

var FilterClick = function(objTD, id) 
{
	if(objChart==null)
		return;

	objChart.showWaiting(true);
	
	//Perform Filter Button Filtering (unless disabled)
	/*if (!netscape4)
	{
		if(objTD.className.search(/disabled/) > -1) return;
	}*/

	 
	var catType = arrTypeNames[id];
	//alert(catType);
	var filter = objChart.createTypeFilter(catType);//This will either create a type filter or if it has laready been
							//generated
	//alert(filter);
	ShowSelectState(objTD,objChart.isFilterOn(filter)); //Indicate state on Filter Button
	
	objChart.filter(filter,!objChart.isFilterOn(filter));
	objChart.reorganize();
	objChart.showWaiting(false);
}


var NS4FilterClick = function(objTD, id) {
		//if (!netscape4) return;
		FilterClick(objTD, id);
	}


var LinkFilterClick = function(objTD, id) 
{

	if(objChart==null)
		return;

	objChart.showWaiting(true);
	
	//Perform Filter Button Filtering (unless disabled)
	
	var catType = arrTypeFuncNames[id];
//alert(catType);
	ShowSelectState(objTD, objChart.isFiltered(catType)); //Indicate state on Filter Button
	//objChart.filterType(catType, !objChart.isFiltered(catType));
	

	var strKey = objChart.createConnectedByFilter(catType, "");
	objChart.filter(strKey, !objChart.isFilterOn(strKey));

	
	objChart.reorganize();
	objChart.showWaiting(false);
}
//This array holds the values of the VLVF Property "EntityType" which must be on each end, to indicate
//which filter button it responds to.
var arrTypeNames = new Array(
    "Person",
    "Company"
    );

var arrTypeFuncNames = new Array(
    "Function",
    "Has Shares"
    );



