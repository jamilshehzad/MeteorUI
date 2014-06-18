VLXVisualizer = function(cb)
{
	var port = window.location.port;
	if(!port) {
		port = window.location.protocol == "https:" ? "443" : "80";
	}
	var baseURL = window.location.protocol + "//" + window.location.hostname + ":" + port + "/api";

	// VLXViewer event codes
	var EVENT_NONE 				= 0;
	var EVENT_UNUSED1 			= 1;
	var EVENT_UNUSED2 			= 2;
	var EVENT_UNUSED3 			= 3;
	var EVENT_UNUSED4  			= 4;
	var EVENT_UNUSED5 			= 5;
	var EVENT_MENU_COMMAND 			= 6;
	var EVENT_DRAG_OUT 			= 7;
	var EVENT_ERROR_OCCURRED 		= 8;
	var EVENT_MOUSEIN 			= 9;
	var EVENT_MOUSEOUT 			= 10;
	var EVENT_DOUBLECLICK 			= 11;
	var EVENT_CLICK 			= 12;
	var EVENT_LAYOUTDONE	 		= 13;
	var EVENT_FILEDONE 			= 14;
	var EVENT_CONTEXTMENU 			= 15;
	var EVENT_OVERRIDE 			= 16;
	var EVENT_MODIFIED_CHANGED 		= 17;
	var EVENT_UNUSED18	 		= 18;
	var EVENT_SHOW_HELP 			= 19;
	var EVENT_BUFFERREADY 			= 20;
	var EVENT_SELECTIONCHANGED 		= 21;
	var EVENT_WARNING		 	= 22;
	var EVENT_ZOOMDONE 			= 23;
	var EVENT_TIMEBARCHANGE			= 24;
	var EVENT_VISIBILITYCHANGED		= 25;
	var EVENT_TOOLBAR_COMMAND		= 26;

	// VLXViewer applet handle
	objChart = null;

	// used for context menu: id of last clicked item
	var lastClickedOnID = "";

	// this function is called first. It waits VLXViewer applet to load.
	function waitViewerToLoad() {
		if(!document.VLVChart)
		{
			// not loaded, try again in 200ms
			setTimeout(waitViewerToLoad, 200);
		}
		else
		{
			// loaded. Poll events
			objChart = document.VLVChart;
			PollEvent();
			// execute callback function
			if(cb) {
				cb(this);
			}
		}
	}

	// function loads data from specified URL
	loadData = function(objectType, objectId) {
		var dataURL = baseURL;

		if(objectType == "Company") {
			dataURL = dataURL + "?action=show_company&company_id=" + objectId;
		}

		if(objectType == "Person") {
			dataURL = dataURL + "?action=show_person&person_id=" + objectId;
		}
		objChart.showWaiting(true);
		objChart.setFile(dataURL);		
	}

	expandItem = function(objectType, objectId, itemId) {
		var dataURL = "";

		if(objectType == "Company") {
			dataURL = baseURL + "?action=expand_company&company_id=" + objectId;
		}

		if(objectType == "Person") {
			dataURL = baseURL + "?action=expand_person&person_id=" + objectId;
		}

		if(!dataURL) {
			return;
		}

		objChart.showWaiting(true);
		objChart.mergeVLXEx(dataURL, "", itemId, false, false);
	}

	// this function is called from PollEvent() when VLXViewer finishes loading data from database
	function OnDataLoaded() {
		objChart.showWaiting(false);				
		objChart.reorganize();		
	}

	// this function is called from PollEvent() when VLXViewer finishes reorganizing chart animation
	function OnReorgDone() {
		objChart.showWaiting(false);
		objChart.zoomToFitEx(true, 1,false);
	}


	function OnDoubleClick(strParam) {
		var itemId = strParam.substring(0, strParam.lastIndexOf(":"));
		var objectType = objChart.getItemType(itemId); 

		var objectId = objChart.getPropertyValue(itemId, 'identityProperty');
		expandItem(objectType, objectId, itemId);
	}

	function OnContextMenu(strParam) {
		lastClickedOnID = strParam.substring(strParam.lastIndexOf(" : ")+3, strParam.length)
		var objectType = objChart.getItemType(lastClickedOnID);

		objChart.clearMenuItems();	

		if(objectType == "Company" || objectType == "Person") {
			objChart.addMenuItem(100, "Expand");
			objChart.addMenuItem(101, "Properties");
		}
		if(objectType == "Company" || objectType == "Person" || objectType == "Function" || objectType == "Has Shares") {
			objChart.addMenuitem(102,"Delete");
		}

		objChart.showMenu();
	}

	function OnMenuCommand(strParam) {
		if(strParam == 100) {
			var itemId = lastClickedOnID;

			var objectType = objChart.getItemType(itemId); 
			var objectId = objChart.getPropertyValue(itemId, 'identityProperty');
			expandItem(objectType, objectId, itemId);
		} else
		if(strParam == 101) {
			$("#VLVChart").addClass("shrink");
			$("#example-modal").modal({});
		}else if(strParam == 102) {
			var itemId = lastClickedOnID;
			objChart.setElementDeleted(itemId,true,false);
		}
		lastClickedOnID = "";
	}

	// this function is called from PollEvent() when VLXViewer generates error
	function OnError(strParam) {
		alert(strParam)
	}

	// this function is called from waitViewerToLoad() when VLXViever is loaded. It receives and process VLXViewer events.
	function PollEvent() 
	{
		if(!objChart.getEvent) {
			return;
		}
		var strEvent = String(objChart.getEvent());
		var iEventID = Number(strEvent.substring(0, strEvent.search(/:/)));
		var strParam = String(strEvent.substring(strEvent.search(/:/)+1, strEvent.length));
		if(iEventID > 0) 
		{
			var strEventDescription="";//??
			switch(iEventID) 
			{
				case EVENT_LAYOUTDONE:
					OnReorgDone();
					break;
				case EVENT_FILEDONE:
					OnDataLoaded();
					break;
				case EVENT_DOUBLECLICK:
					OnDoubleClick(strParam);
					break;
				case EVENT_CONTEXTMENU:
					OnContextMenu(strParam);
					break;
				case EVENT_MENU_COMMAND:
					OnMenuCommand(strParam)
					break;

				case EVENT_ERROR_OCCURRED: 
					OnError(strParam);
					break;

				//events below are not used in this example
				case EVENT_SHOW_HELP:
				case EVENT_MENU_COMMAND:
				case EVENT_NONE:
				case EVENT_MOUSEIN:
				case EVENT_MOUSEOUT:
				case EVENT_DOUBLECLICK:
				case EVENT_CLICK:
				case EVENT_OVERRIDE:
				case EVENT_MODIFIED_CHANGED:
				case EVENT_BUFFERREADY:
				case EVENT_SELECTIONCHANGED:
				case EVENT_WARNING:
					break;
			}
			window.setTimeout(PollEvent, 0); //event found so try again immediately
			return;
		}
		window.setTimeout(PollEvent, 200); //no event found so try again in 1/5 sec
	}
	waitViewerToLoad();	
	
}
